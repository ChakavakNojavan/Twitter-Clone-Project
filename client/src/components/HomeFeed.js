import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "./CurrentUserContext";
import { FiHeart, FiMessageCircle, FiRepeat, FiShare } from "react-icons/fi";
import { FadeLoader } from "react-spinners";
import { COLORS } from "./constants";
import moment from "moment";
import { Link } from "react-router-dom";
const Wrapper = styled.div`
  margin-left: 300px;
  font-family: sans-serif;
`;
const InputBox = styled.div`
  position: relative;
  border-radius: 20px;
  background-color: white;
  padding: 10px;
  width: 600px;
`;
const ProfileImg = styled.img`
  length: 50px;
  width: 50px;
  border-radius: 50%;
  padding-right: 10px;
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
  length: 80%;
  width: 80%;
  border-radius: 10px;
  margin-left: 10px;
`;
const Input = styled.input`
  width: 100%;
  height: 120px;
  border: 1px solid ${(props) => (props.inputError ? "red" : "#ccc")};
  padding: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #0077ff;
  }
`;

const Warning = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 0;
`;
const Button = styled.button`
  background-color: ${COLORS.primary};
  position: absolute;
  bottom: 25px;
  right: 15px;
  color: white;
  border-radius: 20px;
  padding: 10px 20px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
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
const CharacterCounter = styled.div`
  color: ${(props) =>
    props.remainingChars < 0
      ? "red"
      : props.remainingChars < 55
      ? "yellow"
      : "inherit"};
  font-size: 14px;
  position: absolute;
  bottom: 25px;
  right: 95px;
  padding: 0 10px 10px 0;
`;
const StyledLink = styled(Link)`
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
const HomeFeed = () => {
  const [data, setData] = useState(null);
  const [newTweetText, setNewTweetText] = useState("");
  const { currentUser } = useContext(CurrentUserContext);
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetch("/api/me/home-feed")
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error(error));
    }
  }, [currentUser]);

  const handleNewTweetChange = (event) => {
    const value = event.target.value;
    setNewTweetText(value);

    if (value.length > 280 * 0.8) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  };

  const inputMaxLength = 280;

  const handleNewTweetSubmit = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newTweetText }),
    };
    fetch("/api/tweet", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) => ({
          tweetIds: [data.tweet.id, ...prevData.tweetIds],
          tweetsById: { [data.tweet.id]: data.tweet, ...prevData.tweetsById },
        }));
        setNewTweetText("");
      })
      .catch((error) => console.error(error));
  };

  return (
    <Wrapper>
      <h2>Home</h2>

      <form onSubmit={handleNewTweetSubmit}>
        <InputBox>
          <Input
            type="text"
            placeholder="What's happening?"
            value={newTweetText}
            onChange={handleNewTweetChange}
            maxLength={inputMaxLength}
            style={{ borderColor: inputError ? "red" : "" }}
          />
          <CharacterCounter
            remainingChars={inputMaxLength - newTweetText.length}
          >
            {inputMaxLength - newTweetText.length}
          </CharacterCounter>
          {inputError && <Warning>Maximum character limit exceeded!</Warning>}
          <Button
            type="submit"
            disabled={inputError || newTweetText.length === 0}
          >
            Meow
          </Button>
        </InputBox>
      </form>

      {!data ? (
        <Spinner color={"gray"} loading={true} size={20} />
      ) : (
        <div>
          {data.tweetIds.map((tweetId) => {
            const tweet = data.tweetsById[tweetId];
            const timestamp = tweet.timestamp;
            const formattedDate = moment(timestamp).format("MMM DD");
            return (
              <StyledLink key={tweet.id} to={`/tweet/${tweet.id}`}>
                <Tweet>
                  <Author>
                    <ProfileImg
                      src={tweet.author.avatarSrc}
                      alt="profile picture"
                    />
                    <AuthorInfo>
                      <StyledLink to={`/${tweet.author.handle}`}>
                        <DisplayName>{tweet.author.displayName}</DisplayName>
                        <Handle>@{tweet.author.handle} </Handle>
                      </StyledLink>
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
                  <Icon3 />
                  <Icon4 />
                </Tweet>
              </StyledLink>
            );
          })}
        </div>
      )}
    </Wrapper>
  );
};

export default HomeFeed;
