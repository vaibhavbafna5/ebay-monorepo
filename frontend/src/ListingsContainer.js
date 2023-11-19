import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { useEffect, useState } from "react";
import ProductContainer from './ProductContainer';
import CopyProductContainer from './CopyProductContainer';

export default function ListingsContainer(props) {
  const [selectedProduct, setSelectedProduct] = useState({});
  const [label, setSelectedLabel] = useState("");

  const handleSelect = (event, newValue) => {
    // console.log("douchebag: ", selectedProduct);
    // console.log("merp: ", selectedProduct == {})
    // console.log("new value: ", newValue);
    setSelectedProduct(newValue);
    setSelectedLabel(newValue["itemId"]);
  }

  return (
    <div style={{width: "720px", marginRight: "18px"}}>
      {
          props.yourListings ? (
              <h2>Your Listings</h2>
          ) : (
              <h2>Competitor Listings</h2>
          )
      }
      <Autocomplete
        disableClearable 
        options={props.selectedProductData}
        groupBy={(option) => option.sellerInfo.sellerUserName}
        getOptionLabel={(option) => option.title}
        onChange={handleSelect}
        // renderOption={(props, option) => {
        //   return (
        //     <li {...props} key={option.itemId}>
        //       {option.title}
        //     </li>
        //   );
        // }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.yourListings? "Your Listings" : "Competitor Listings"}
          />
        )}
      />
      <CopyProductContainer key={label} selectedProduct={selectedProduct}/>
      {/* <ProductContainer selectedProduct={selectedProduct}/> */}
    </div>
  );
}