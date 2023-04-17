import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { COLORS } from "./constants";
import { FiHeart, FiMessageCircle, FiRepeat, FiShare } from "react-icons/fi";
import { FadeLoader } from "react-spinners";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FaBomb } from "react-icons/fa";
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

const ProfileImg2 = styled.img`
  length: 50px;
  width: 50px;
  border-radius: 50%;
  padding-right: 10px;
`;
const StyledTweet = styled.div`
  border: 1px solid white;
  width: 600px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
`;
const TweetImg = styled.img`
  length: 80%;
  width: 80%;
  border-radius: 10px;
  margin-left: 10px;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
`;
const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
`;
const Icon1 = styled(FiMessageCircle)`
  padding-left: 20px;
`;
const Icon2 = styled(FiRepeat)`
  padding-left: 120px;
`;
const Icon3 = styled(FiHeart)`
  padding-left: 120px;
`;
const Icon4 = styled(FiShare)`
  padding-left: 120px;
`;
const Spinner = styled(FadeLoader)`
  font-size: 50px;
  margin-left: 300px;
`;
const StyledLink = styled.div`
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const DisplayName = styled.h4`
  margin: 0 5px 0 0;
  top: 20px;
`;
const Handle = styled.p`
  color: gray;
  font-size: 15px;
`;
const Status = styled.p`
  margin-left: 20px;
  font-size: 16px;
`;
const TimeStamp = styled.p`
  color: gray;
  font-size: 15px;
  padding-left: 5px;
`;
const ErrorMessage = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
font-weight: bold;
text-align: center;
}
`;
const Icon5 = styled(FaBomb)`
  font-size: 100px;
`;
const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { profileId } = useParams();
  const [tweets, setTweets] = useState([]);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

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
    fetch(`/api/${profileId}/feed`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        setError(
          <ErrorMessage>
            <Icon5 />
            <h1>An unknown error has occurred.</h1>
            <h3>Please try refreshing the page.</h3>
          </ErrorMessage>
        );
      });
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

      {!tweets ? (
        <Spinner color={"gray"} loading={true} size={20} />
      ) : (
        <div>
          {tweets.map((tweet) => {
            const timestamp = tweet.timestamp;
            const formattedDate = moment(timestamp).format("MMM DD");
            const handleTweetClick = (event) => {
              event.preventDefault();
              navigate(`/tweet/${tweet.id}`);
            };
            const handleAuthorClick = (event) => {
              event.preventDefault();
              event.stopPropagation();
              navigate(`/${tweet.author.handle}`);
            };
            const handleLikeClick = (event, id) => {
              event.stopPropagation();
              setLikes({ ...likes, [id]: !likes[id] });
            };

            return (
              <StyledLink key={tweet.id} onClick={handleTweetClick}>
                <StyledTweet>
                  <Author onClick={handleAuthorClick}>
                    <ProfileImg2
                      src={tweet.author.avatarSrc}
                      alt="profile picture"
                    />
                    <AuthorInfo>
                      <DisplayName>{tweet.author.displayName}</DisplayName>
                      <Handle>@{tweet.author.handle} </Handle>
                      <TimeStamp>- {formattedDate}</TimeStamp>
                    </AuthorInfo>
                  </Author>
                  <Status>{tweet.status}</Status>
                  {tweet.media.length > 0 && (
                    <TweetImg src={tweet.media[0].url} alt="tweet media" />
                  )}
                  <br />
                  <br />
                  <Icon1 />
                  <Icon2 />
                  <Icon3
                    onClick={(event) => handleLikeClick(event, tweet.id)}
                    style={{ fill: likes[tweet.id] ? "red" : "none" }}
                  />

                  <span>{likes[tweet.id] ? 1 : ""}</span>

                  <Icon4 />
                </StyledTweet>
              </StyledLink>
            );
          })}
        </div>
      )}
    </Wrapper>
  );
};
const ProfileWrapper = () => {
  const currentUser = null;
  return <Profile currentUser={currentUser} />;
};

export default ProfileWrapper;
