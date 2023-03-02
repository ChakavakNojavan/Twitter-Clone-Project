import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FiHeart, FiMessageCircle, FiRepeat, FiShare } from "react-icons/fi";
import { FadeLoader } from "react-spinners";
import moment from "moment";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  margin-left: 300px;
  font-family: sans-serif;
`;
const ProfileImg = styled.img`
  length: 60px;
  width: 60px;
  border-radius: 50%;
`;
const Tweet = styled.div`
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
  length: 95%;
  width: 95%;
  border-radius: 10px;
  margin-left: 10px;
`;
const Author = styled.div`
  display: flex;
  align-items: center;
`;
const AuthorInfo = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  margin-right: 10px;
  line-height: 0.4;
`;
const Icon1 = styled(FiMessageCircle)`
  padding-left: 40px;
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
  margin: 0 auto;
  font-size: 50px;
`;
const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;
const DisplayName = styled.h4`
  margin: 0 5px 0 0;
  top: 20px;
`;
const Handle = styled.p`
  color: gray;
  font-size: 14px;
`;
const Status = styled.p`
  margin-left: 20px;
  font-size: 18px;
`;
const TimeStamp = styled.p`
  color: gray;
  font-size: 15px;
  padding-left: 5px;
  padding-left: 20px;
`;
function TweetDetails() {
  const [tweet, setTweet] = useState(null);
  const { tweetId } = useParams();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/tweet/${tweetId}`);
        const data = await response.json();
        setTweet(data.tweet);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [tweetId]);

  if (!tweet) {
    return <div>Loading tweet details...</div>;
  }
  const timestamp = tweet.timestamp;
  const formattedDate = moment(timestamp).format("h:mm A . MMM DD YYYY");
  return (
    <Wrapper>
      <Tweet>
        <Author>
          <ProfileImg src={tweet.author.avatarSrc} alt="profile picture" />
          <AuthorInfo>
            <StyledLink to={`/${tweet.author.handle}`}>
              <DisplayName>{tweet.author.displayName}</DisplayName>
              <Handle>@{tweet.author.handle} </Handle>
            </StyledLink>
          </AuthorInfo>
        </Author>
        <Status>{tweet.status}</Status>
        {tweet.media.length > 0 && (
          <TweetImg src={tweet.media[0].url} alt="tweet media" />
        )}
        <br />

        <TimeStamp>{formattedDate} . Critter web app</TimeStamp>
        <Icon1 />
        <Icon2 />
        <Icon3 />
        <Icon4 />
      </Tweet>
    </Wrapper>
  );
}

export default TweetDetails;
