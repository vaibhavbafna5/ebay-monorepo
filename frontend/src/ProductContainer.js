import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { useEffect, useState, useLayoutEffect } from "react";

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function ProductContainer(props) {
    const [selectedVariationKey, setSelectedVariationKey] = useState("");
    const [productDetails, setProductDetails] = useState({});

    // This code will run before the component renders

    const handleSelect = (event, newValue) => {
        console.log("productDetails: ", productDetails);
        console.log("productDetailsComp: ", productDetails == {})
        console.log("bonjour bingo", newValue);
        console.log("likely guess", props.selectedProduct.variations.variations)
        console.log("lucky guess", props.selectedProduct.variations.variations[newValue]);
        setProductDetails(props.selectedProduct.variations.variations[newValue]);
    }

  return (
    <Box key={props.selectedProduct.viewItemURL} sx={{ minWidth: 275 }} style={{marginTop: "8px"}}>
        {
            Object.keys(props.selectedProduct).length != 0  ? (
                    <Card variant="outlined">
                        <React.Fragment>
                            <CardContent>
                                {/* <Stack direction="row"> */}
                                    <>
                                        <Typography variant="h5" component="div">
                                            {props.selectedProduct.title}
                                        </Typography>
                                        <Stack direction="row">
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                {props.selectedProduct.sellerInfo.sellerUserName} ({props.selectedProduct.sellerInfo.feedbackScore}) {bull} {props.selectedProduct.sellerInfo.positiveFeedbackPercent}% Positive Feedback
                                            </Typography>
                                        </Stack>
                                    </>
                                    <Stack direction="row" style={{paddingTop: "24px"}}>
                                        <Box 
                                            component="img"
                                            sx={{
                                                height: 200,
                                                width: 150,
                                                maxHeight: { xs: 233, md: 167 },
                                                maxWidth: { xs: 350, md: 250 },
                                            }}
                                            src={props.selectedProduct.galleryURL}
                                            style={{paddingRight: "12px"}}
                                        >
                                        </Box>
                                        <Box sx={{ minWidth: 210 }}>
                                            {
                                                Object.keys(props.selectedProduct.variations).length != 0 ? (
                                                    <Autocomplete
                                                        options={props.selectedProduct.variations["variations_values"]}
                                                        renderOption={(props, option) => {
                                                            return (
                                                                <li {...props} key={option}>
                                                                {option}
                                                                </li>
                                                            );
                                                        }}
                                                        defaultValue={Object.keys(props.selectedProduct.variations["variations"])[0]}
                                                        renderInput={(params) => (
                                                            <TextField
                                                            {...params}
                                                            label={props.selectedProduct.variations.category}
                                                            />
                                                        )}
                                                        onChange={handleSelect}
                                                        disableClearable
                                                    />
                                                ) : (<></>)

                                            }
                                            {
                                                Object.keys(productDetails).length == 0 && Object.keys(props.selectedProduct.variations).length != 0 ? (
                                                    (() => {
                                                        const defaultKey = Object.keys(props.selectedProduct.variations["variations"])[0];
                                                        setProductDetails(props.selectedProduct.variations["variations"][defaultKey])
                                                        return <>
                                                                <Typography variant="h6" component="div">
                                                                    {productDetails['currency']} {productDetails['price']}
                                                                </Typography>
                                                                <Typography variant="h7" component="div">
                                                                    Quantity Sold: {productDetails['quantity_sold']}
                                                                </Typography>
                                                                {
                                                                    props.selectedProduct.shippingInfo.shippingType == "Free" ? (
                                                                        <Typography variant="h7" component="div">Free Shipping</Typography>
                                                                    ) : (
                                                                        <Typography variant="h7" component="div">${props.selectedProduct.shippingInfo.shippingServiceCost.value} Shipping</Typography>
                                                                    )
                                                                }
                                                            </>;
                                                      })()
                                                ) : Object.keys(productDetails).length != 0 && Object.keys(props.selectedProduct.variations).length != 0 ? (
                                                    <>
                                                        <Typography variant="h6" component="div">
                                                            {productDetails['currency']} {productDetails['price']}
                                                        </Typography>
                                                        <Typography variant="h7" component="div">
                                                            Quantity Sold: {productDetails['quantity_sold']}
                                                        </Typography>
                                                        {
                                                            props.selectedProduct.shippingInfo.shippingType == "Free" ? (
                                                                <Typography variant="h7" component="div">Free Shipping</Typography>
                                                            ) : (
                                                                <Typography variant="h7" component="div">${props.selectedProduct.shippingInfo.shippingServiceCost.value} Shipping</Typography>
                                                            )
                                                        }
                                                    </>
                                                ) : (
                                                    <>
                                                        <Typography variant="h6" component="div">
                                                            {props.selectedProduct.sellingStatus.currentPrice._currencyId} {props.selectedProduct.sellingStatus.currentPrice.value}
                                                        </Typography>
                                                        {
                                                            props.selectedProduct.shippingInfo.shippingType == "Free" ? (
                                                                <Typography variant="h7" component="div">Free Shipping</Typography>
                                                            ) : (
                                                                <Typography variant="h7" component="div">${props.selectedProduct.shippingInfo.shippingServiceCost.value} Shipping</Typography>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }
                                        </Box>
                                    </Stack>
                                {/* </Stack> */}
                            </CardContent>
                            <CardActions>
                                <Button size="small" href={props.selectedProduct.viewItemURL}>View URL</Button>
                            </CardActions>
                        </React.Fragment>
                    </Card>
            ) : 
            (
                <></>
            )
        }
    </Box>
  );
}