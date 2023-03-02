import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeFeed from "./HomeFeed";
import Notifications from "./Notifications";
import Bookmarks from "./Bookmarks";
import TweetDetails from "./TweetDetails";
import ProfileWrapper from "./Profile";
import Sidebar from "./Sidebar";
import { CurrentUserProvider } from "./CurrentUserContext";
import ErrorBoundary from "./ErrorBoundary";

const App = () => (
  <CurrentUserProvider>
    <div>
      <BrowserRouter>
        <Sidebar />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomeFeed />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/tweet/:tweetId" element={<TweetDetails />} />
            <Route path="/:profileId" element={<ProfileWrapper />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  </CurrentUserProvider>
);

export default App;
