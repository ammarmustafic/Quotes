import React, { useState, useEffect } from 'react';
import './quote.css';
import axios from 'axios';
import { Pagination } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LoginComponent from './../LoginComponent/login'; 

const QuoteComponent = () => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const [userVotes, setUserVotes] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState('');

  const quotesPerPage = 5;

  const fetchQuotes = async () => {
    try {
      const accessToken = 'yuim98oq-e275-45a2-bc2e-b3098036d655';
      const response = await axios.get('http://localhost:8000/quotes', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = response.data;
      setQuotes(data.quotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError('Error fetching quotes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const accessToken = 'yuim98oq-e275-45a2-bc2e-b3098036d655';
      const response = await axios.get('http://localhost:8000/tags', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = response.data;
      if (data && data.tags) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Error fetching tags. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    fetchTags();
  }, []);

  const handleUpvote = (quoteId) => {
    setUserVotes((prevUserVotes) => {
      const updatedVotes = { ...prevUserVotes };
      if (updatedVotes[quoteId] === 'up') {
        delete updatedVotes[quoteId];
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === quoteId ? { ...quote, upvotesCount: quote.upvotesCount - 1 } : quote
          )
        );
      } else {
        if (updatedVotes[quoteId] === 'down') {
          setQuotes((prevQuotes) =>
            prevQuotes.map((quote) =>
              quote.id === quoteId ? { ...quote, downvotesCount: quote.downvotesCount - 1 } : quote
            )
          );
        }
        updatedVotes[quoteId] = 'up';
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === quoteId ? { ...quote, upvotesCount: quote.upvotesCount + 1 } : quote
          )
        );
      }
      return updatedVotes;
    });
  };

  const handleDownvote = (quoteId) => {
    setUserVotes((prevUserVotes) => {
      const updatedVotes = { ...prevUserVotes };
      if (updatedVotes[quoteId] === 'down') {
        delete updatedVotes[quoteId];
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === quoteId ? { ...quote, downvotesCount: quote.downvotesCount - 1 } : quote
          )
        );
      } else {
        if (updatedVotes[quoteId] === 'up') {
          setQuotes((prevQuotes) =>
            prevQuotes.map((quote) =>
              quote.id === quoteId ? { ...quote, upvotesCount: quote.upvotesCount - 1 } : quote
            )
          );
        }
        updatedVotes[quoteId] = 'down';
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === quoteId ? { ...quote, downvotesCount: quote.downvotesCount + 1 } : quote
          )
        );
      }
      return updatedVotes;
    });
  };

  const handleTagChange = (event) => {
    setSelectedTags(event.target.value);
  };

  const totalQuotes = quotes.length;
  const totalPages = Math.ceil(totalQuotes / quotesPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * quotesPerPage;
  const endIndex = startIndex + quotesPerPage;
  const displayedQuotes = quotes
    .filter((quote) => selectedTags.length === 0 || selectedTags.some((tag) => quote.tags.includes(tag)))
    .slice(startIndex, endIndex);

  const getColorByPercentage = (percentage) => {
    if (percentage >= 80) {
      return 'lime';
    } else if (percentage >= 60) {
      return 'green';
    } else if (percentage >= 40) {
      return 'yellow';
    } else if (percentage >= 20) {
      return 'orange';
    } else {
      return 'orange';
    }
  };

  const handleLogin = (accesToken, username) => {
    setIsLoggedIn(true);
    setUsername(username); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(''); 
  };

  return (
    <div className="quote-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : isLoggedIn ? (
        <>
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: "column" }}>
            <button className="log-out-button" onClick={handleLogout} style={{marginLeft: "1600px"}}>
              Log Out
            </button>
            <p className="username" style={{marginLeft: "1600px", marginTop: "10px", color: "#fff"}}>
              Logged in as: {username}
            </p>
          </div>
          <h1 style={{ color: '#fff', marginBottom: '70px', marginTop: '20px', fontSize: '50px' }}>Quotes</h1>
          {tags.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    display: 'inline-block',
                    background: '#f1f1f1',
                    padding: '4px 8px',
                    marginRight: '8px',
                    borderRadius: '4px',
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <ul className="quote-list">
            {displayedQuotes.map((quote) => {
              const totalVotes = quote.upvotesCount + quote.downvotesCount;
              const positivePercentage = totalVotes > 0 ? Math.round((quote.upvotesCount / totalVotes) * 100) : 0;
              const percentageColor = getColorByPercentage(positivePercentage);
              const userVote = userVotes[quote.id];
  
              return (
                <li key={quote.id} className="quote-item">
                  <p className="quote-content">{quote.content}</p>
                  <p className="quote-author">- {quote.author}</p>
                  <div className="vote-container">
                    <div className="vote-icons">
                      <ArrowDropUpIcon
                        onClick={() => handleUpvote(quote.id)}
                        style={{ color: userVote === 'up' ? 'white' : 'gray', marginBottom: '10px' }}
                      />
                      <p className="vote-percentage" style={{ fontSize: '24px', marginBottom: '10px', color: percentageColor }}>
                        {positivePercentage}%
                      </p>
                      <p className="vote-count" style={{}}>
                        {quote.upvotesCount} / {quote.downvotesCount}
                      </p>
                      <ArrowDropDownIcon
                        onClick={() => handleDownvote(quote.id)}
                        style={{ color: userVote === 'down' ? 'white' : 'gray', marginTop: '10px' }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
  
          {totalPages > 0 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
            />
          )}
        </>
      ) : (
        <LoginComponent onLogin={handleLogin} />
      )}
    </div>
  );
    }
      export default QuoteComponent;
