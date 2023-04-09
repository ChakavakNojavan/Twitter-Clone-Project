import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "./CurrentUserContext";
import { FiHeart, FiMessageCircle, FiRepeat, FiShare } from "react-icons/fi";
import { FaBomb } from "react-icons/fa";
import { FadeLoader } from "react-spinners";
import { COLORS } from "./constants";
import moment from "moment";
import { useNavigate } from "react-router-dom";
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
const Input = styled.textarea`
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
const Icon5 = styled(FaBomb)`
  font-size: 100px;
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
const HomeFeed = () => {
  const [data, setData] = useState(null);
  const [newTweetText, setNewTweetText] = useState("");
  const { currentUser } = useContext(CurrentUserContext);
  const [remainingChars, setRemainingChars] = useState(280);
  const [error, setError] = useState(null);
  const [isInputBoxVisible, setIsInputBoxVisible] = useState(true);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetch("/api/me/home-feed")
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
          setIsInputBoxVisible(false);
        });
    }
  }, [currentUser]);

  const handleNewTweetChange = (event) => {
    const value = event.target.value;
    setNewTweetText(value);
    setRemainingChars(280 - value.length);
  };

  const handleNewTweetSubmit = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newTweetText, likes: 0 }),
    };
    fetch("/api/tweet", requestOptions)
      .then((response) => response.json())
      .then(() => {
        fetch("/api/me/home-feed")
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
            setIsInputBoxVisible(false);
          });
        setNewTweetText("");
      })
      .catch((error) => {
        setError(
          <ErrorMessage>
            <Icon5 />
            <h1>An unknown error has occurred.</h1>
            <h3>Please try refreshing the page.</h3>
          </ErrorMessage>
        );
        setIsInputBoxVisible(false);
      });
  };

  return (
    <Wrapper>
      <h2>Home</h2>
      {error && <div>{error}</div>}
      {isInputBoxVisible && (
        <form onSubmit={handleNewTweetSubmit}>
          <InputBox>
            <Input
              placeholder="What's happening?"
              value={newTweetText}
              onChange={handleNewTweetChange}
              rows={4}
              cols={50}
            />
            <CharacterCounter remainingChars={remainingChars}>
              {remainingChars}
            </CharacterCounter>
            <Button
              type="submit"
              disabled={!newTweetText || remainingChars < 0}
            >
              Meow
            </Button>
          </InputBox>
        </form>
      )}

      {!data ? (
        <Spinner color={"gray"} loading={true} size={20} />
      ) : (
        <div>
          {data.tweetIds.map((tweetId) => {
            const tweet = data.tweetsById[tweetId];
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
                <Tweet>
                  <Author onClick={handleAuthorClick}>
                    <ProfileImg
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
