import React, {useState, useCallback} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import {
  STATE_CODES_ARRAY,
  DISTRICTS_ARRAY,
  STATE_CODES_REVERSE,
} from '../constants';
import Bloodhound from 'corejs-typeahead';

const engine = new Bloodhound({
  initialize: true,
  local: STATE_CODES_ARRAY,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
});

const districtEngine = new Bloodhound({
  initialize: true,
  local: DISTRICTS_ARRAY,
  limit: 5,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('district'),
});

function Search(props) {
  const [searchValue, setSearchValue] = useState('');
  const [expand, setExpand] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = useCallback((searchInput) => {
    const results = [];

    const sync = (datums) => {
      datums.map((result, index) => {
        const stateObj = {
          name: result.name,
          type: 'state',
          route: result.code,
        };
        results.push(stateObj);
        return null;
      });
    };

    const districtSync = (datums) => {
      datums.slice(0, 5).map((result, index) => {
        const districtObj = {
          name: result.district + ', ' + result.state,
          type: 'state',
          route: STATE_CODES_REVERSE[result.state],
        };
        results.push(districtObj);
        return null;
      });
    };

    engine.search(searchInput, sync);
    districtEngine.search(searchInput, districtSync);
    setResults(results);
  }, []);

  return (
    <div className="Search">
      <label>Search your city, resources, etc</label>
      <div className="line"></div>
      <input
        type="text"
        value={searchValue}
        onFocus={(event) => {
          setExpand(true);
        }}
        onBlur={() => {
          setExpand(false);
        }}
        onChange={(event) => {
          setSearchValue(event.target.value);
          handleSearch(event.target.value.toLowerCase());
        }}
      />
      <div className={`search-button`}>
        <Icon.Search />
      </div>
      {results.length > 0 && (
        <div
          className={`close-button`}
          onClick={() => {
            setSearchValue('');
            setResults([]);
          }}
        >
          <Icon.X />
        </div>
      )}
      {results.length > 0 && (
        <div className="results">
          {results.map((result, index) => {
            return (
              <Link key={index} to={`state/${result.route}`}>
                <div className="result">
                  <div className="result-name">{result.name}</div>
                  <div className="result-type">
                    Visit {result?.type?.toLowerCase()} page
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {expand && (
        <div className="expanded">
          <div className="expanded-left">
            <h3>Top Resources</h3>
            <h4> - DIY Face Masks</h4>
            <h4> - MOFHW Tips</h4>
            <h4> - Test Centers in Mumbai</h4>
            <h4> - Symptoms</h4>
            <h4> - Dave</h4>
          </div>
          <div className="expanded-right">
            <h3>Highly Searched</h3>
            <h4> - Hyderabad</h4>
            <h4> - Bengaluru</h4>
            <h4> - Test Centers</h4>
            <h4> - Lockdown</h4>
            <h4> - Also Dave</h4>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
