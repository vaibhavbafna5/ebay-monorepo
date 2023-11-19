// Component imports
import ListingsContainer from './ListingsContainer';

// MUI imports
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

// React imports
import React, { useEffect, useState } from "react";
import { Grid } from '@mui/material';

export default function App() {
  const [data, setData] = useState({});
  const [products, setProducts] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedProductData, setSelectedProductData] = useState([]);
  const [yourProductData, setYourProductData] = useState([]);
  const [competitorProductData, setCompetitorProductData] = useState([]);


  const yourSellers = ["gbafna", "labels1235", "labelsfast", "labelsforme"];

  const handleSelect = (event, newValue) => {
    setSelectedValue(newValue);
    setKeywords(data[newValue]["keywords"]);
    setSelectedProductData(data[newValue]["seller_username_to_listings"]);

    setYourProductData(
      getFilteredListings(data[newValue]["seller_username_to_listings"], true)
    );
    setCompetitorProductData(
      getFilteredListings(data[newValue]["seller_username_to_listings"], false)
    );

    // setYourProductData(
    //   getYourListings(data[newValue]["seller_username_to_listings"])
    // );
    // setCompetitorProductData(
    //   getCompetitorListings(data[newValue]["seller_username_to_listings"])
    // );

    // console.log("keywords: ", keywords);
  }

  const handleRegenerateClick = () => {
    console.log("mr. paneer");
    regenerateData();
  }

  function getFilteredListings(copyOfSelectedProductData, shouldFilterCompetitors) {
    var yourSelectedProductData = []
    for (let k in copyOfSelectedProductData) {
      if (shouldFilterCompetitors && yourSellers.includes(k)) {
        for (let j in copyOfSelectedProductData[k]["raw_ebay_responses_v2"]) {
          yourSelectedProductData.push(
            copyOfSelectedProductData[k]["raw_ebay_responses_v2"][j]
          )
        }
      } else if (!shouldFilterCompetitors && !(yourSellers.includes(k))) {
        for (let j in copyOfSelectedProductData[k]["raw_ebay_responses_v2"]) {
          yourSelectedProductData.push(
            copyOfSelectedProductData[k]["raw_ebay_responses_v2"][j]
          )
        }
      }
    }

    // console.log("condition: ", shouldFilterCompetitors);
    // console.log("result: ", yourSelectedProductData);

    return yourSelectedProductData;
  }

  function getYourListings(copyOfSelectedProductData) {
    var yourSelectedProductData = []
    for (let k in copyOfSelectedProductData) {
      if (yourSellers.includes(k)) {
        // console.log("in loop again");
        yourSelectedProductData = yourSelectedProductData.concat(copyOfSelectedProductData[k]["raw_ebay_responses"]);
      }
    }

    // console.log("oy beelo", yourSelectedProductData);
    return yourSelectedProductData;
  }

  function getCompetitorListings(copyOfSelectedProductData) {
    var competitorSelectedProductData = []
    for (let k in copyOfSelectedProductData) {
      if (!(yourSellers.includes(k))) {
        // console.log("in loop");
        competitorSelectedProductData = competitorSelectedProductData.concat(copyOfSelectedProductData[k]["raw_ebay_responses"]);
      }
    }

    // console.log("oy bijou", competitorSelectedProductData);
    return competitorSelectedProductData;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/get-raw-products"); 
      const result = await response.json();
      // console.log("ayyo: ", result);
      setData(result);
      setProducts(Object.keys(result));
    } catch (error) {
      console.error("error: ", error);
    }
  }

  const regenerateData = async () => {
    try {
      const response = await fetch("/api/regenerate");
      const result = await response.json();
    } catch (error) {
      console.error("error", error);
    }
  }

    return(
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              <b>The Gobstopper</b>
            </Typography>
            <Button color="inherit" onClick={handleRegenerateClick}>
              Regenerate
            </Button>
          </Toolbar>
        </AppBar>
        <Grid style={{margin: "24px"}}>
          <div style={{paddingBottom: "8px",}}>
            <h2 style={{color: "black"}}>
              Compare your products against your competition's products for a specific product category & given keywords.
            </h2>
            <p style={{color: "black"}}>
              <a href="https://docs.google.com/spreadsheets/d/1xNeCEVNH5Lsi1cEE7eyfwSQL6Gx1Y3yite6Ao9Ktvk8/edit?usp=sharing">This spreadsheet</a> contains multiple sheets, where each sheet corresponds to a product (as indicated by the spreadsheet title).
              The values you see in the first column are all of the keywords you believe your product should appear in. The same set of keywords are used to identify your competitors
              as well. If you've updated the spreadsheet and want to update your tracking, hit the "Regenerate" button.
              Give it a few minutes since I'm lazy and didn't want to multithread this, then refresh the page, and the updated "pairings" should appear.
            </p>
          </div>
          <h2>Select Product/Keywords Pairing</h2>
          <Autocomplete
            disablePortal
            disableClearable
            id="combo-box-demo"
            options={products}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Select Product" />}
            value={selectedValue}
            onChange={handleSelect}
          />
          <Stack direction="row" spacing={1} style={{paddingTop: "12px"}}>
            {keywords.length > 0 ? (
              keywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                />
              ))
            ) : (<></>)}
          </Stack>
          <Stack direction="row" style={{width: "100%", paddingTop: "24px"}}>
              <ListingsContainer yourListings={true} selectedProductData={yourProductData}/>
              <ListingsContainer yourListings={false} selectedProductData={competitorProductData}/>
          </Stack>
        </Grid>
      </Box>
    );
}

