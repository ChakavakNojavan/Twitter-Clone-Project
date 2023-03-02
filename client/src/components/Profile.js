import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { COLORS } from "./constants";
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  margin-left: 300px;
  font-family: sans-serif;
  max-width: 600px;
  overflow-y: auto;
  height: 100vh;
`;

const ProfileImg = styled.img`
  length: 100px;
  width: 100px;
  border-radius: 50%;
  border: 2px solid white;
`;
const BannerImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;
const FollowButton = styled.button`
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
`;

const UserInfo = styled.div`
  margin-top: 16px;
  p {
    margin: 8px 0;
    font-size: 16px;
  }
`;

const UserStats = styled.div`
  display: flex;
  margin-top: 16px;
`;

const Stat = styled.div`
  margin-right: 16px;
  p:first-child {
    font-size: 16px;
    font-weight: bold;
  }
  p:last-child {
    margin-top: 4px;
    font-size: 16px;
  }
`;

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [feedData, setFeedData] = useState(null);
  const { profileId } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let response = await fetch(`/api/${profileId}/profile`);
        const data = await response.json();
        setProfileData(data.profile);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfileData();
  }, [profileId]);
  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        let response = await fetch(`/api/${profileId}/feed`);
        const data = await response.json();

        const tweets = Object.values(data.tweetsById);

        setFeedData(tweets);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeedData();
  }, [profileId]);

  if (!profileData) {
    return <h2>Loading...</h2>;
  }

  const {
    displayName,
    handle,
    bio,
    location,
    website,
    numFollowing,
    numFollowers,
    isBeingFollowedByYou,
    isFollowingYou,
    avatarSrc,
    bannerSrc,
    joined,
  } = profileData;

  return (
    <Wrapper>
      <BannerImg src={bannerSrc} alt="banner" />
      <ProfileImg src={avatarSrc} alt="profile picture" />
      <h2>{displayName}</h2>
      <p>@{handle}</p>
      {isBeingFollowedByYou ? (
        <p>You're following this user</p>
      ) : (
        <FollowButton>Follow</FollowButton>
      )}
      <UserInfo>
        {bio && <p>{bio}</p>}
        {location && <p>Location: {location}</p>}
        {website && (
          <p>
            Website:{" "}
            <a href={website} target="_blank" rel="noreferrer">
              {website}
            </a>
          </p>
        )}
      </UserInfo>
      <UserStats>
        <Stat>
          <p>Following</p>
          <p>{numFollowing}</p>
        </Stat>
        <Stat>
          <p>Followers</p>
          <p>{numFollowers}</p>
        </Stat>
        {isFollowingYou && <p>You're followed by this user</p>}
      </UserStats>
      {feedData &&
        feedData.map((tweet) => (
          <div key={tweet.id}>
            <p>
              {tweet.author.displayName} (@{tweet.author.handle})
            </p>
            <p>{tweet.status}</p>
            {tweet.media &&
              tweet.media.map((media) => (
                <img key={media.url} src={media.url} alt="media" />
              ))}
          </div>
        ))}
    </Wrapper>
  );
};
const ProfileWrapper = () => {
  const currentUser = null;
  return <Profile currentUser={currentUser} />;
};

export default ProfileWrapper;
