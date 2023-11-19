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

export default function CopyProductContainer(props) {
    const [selectedVariationKey, setSelectedVariationKey] = useState("");
    const [productDetails, setProductDetails] = useState({});

    const handleSelect = (event, newValue) => {
        // console.log("productDetails: ", productDetails);
        // console.log("productDetailsComp: ", productDetails == {})
        // console.log("bonjour bingo", newValue);
        // console.log("likely guess", props.selectedProduct.variations.variations)
        // console.log("lucky guess", props.selectedProduct.variations.variations[newValue]);
        setProductDetails(props.selectedProduct.variations.variations[newValue]);
    }

  return (
    <Box key={props.label} sx={{ minWidth: 275 }} style={{marginTop: "8px"}}>
        {
            Object.keys(props.selectedProduct).length != 0  ? (
                    <Card variant="outlined">
                        <React.Fragment>
                            <CardContent>
                                {/* <Stack direction="row"> */}
                                    <>
                                        <Typography style={{paddingBottom: "4px"}} variant="h5" component="div">
                                            {props.selectedProduct.title}
                                        </Typography>
                                        <Stack direction="column">
                                            <Stack direction="row">
                                                <Typography color="text.secondary">
                                                    {props.selectedProduct.sellerInfo.sellerUserName} ({props.selectedProduct.sellerInfo.feedbackScore}) {bull} {props.selectedProduct.sellerInfo.positiveFeedbackPercent}% Positive Feedback
                                                </Typography>
                                            </Stack>
                                            <Typography color="text.secondary">
                                                Item ID: {props.selectedProduct.itemId}
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
                                                        disableClearable
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
                                                    />
                                                ) : (<></>)

                                            }
                                            {
                                                // case where no product variations, resort to default
                                                Object.keys(props.selectedProduct.variations).length == 0 ? (
                                                    <>
                                                        <Typography variant="h6" component="div">
                                                            {props.selectedProduct.sellingStatus.currentPrice._currencyId} {props.selectedProduct.sellingStatus.currentPrice.value}
                                                        </Typography>
                                                        {
                                                            props.selectedProduct.shippingInfo.shippingType == "Free" ? (
                                                                <Typography variant="h7" component="div">Free Shipping</Typography>
                                                            ) : props.selectedProduct.shippingInfo.shippingType == "Calculated" ? (
                                                                <Typography variant="h7" component="div">Calculated</Typography>
                                                            ) : (
                                                                <Typography variant="h7" component="div">${props.selectedProduct.shippingInfo.shippingServiceCost.value} Shipping</Typography>
                                                            )
                                                        }
                                                    </>
                                                // case where product variations, but none selected yet resort to default
                                                ) : Object.keys(props.selectedProduct.variations).length != 0 && Object.keys(productDetails).length == 0 ? (
                                                    (() => {
                                                        const defaultKey = Object.keys(props.selectedProduct.variations["variations"])[0];
                                                        console.log("blah blah blah");
                                                        return <>
                                                                    <Typography variant="h6" component="div">
                                                                        {props.selectedProduct.variations["variations"][defaultKey]['currency']} {props.selectedProduct.variations["variations"][defaultKey]['price']}
                                                                        {/* {productDetails['currency']} {productDetails['price']} */}
                                                                    </Typography>
                                                                    <Typography variant="h7" component="div">
                                                                        Quantity Sold: {props.selectedProduct.variations["variations"][defaultKey]['quantity_sold']}
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
                                                // case where product variations, but one selected --> resort to non-default
                                                ) : Object.keys(props.selectedProduct.variations) != 0 && Object.keys(productDetails).length != 0 ? (
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
                                                    </>
                                                )
                                            }
                                            {/* {
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
                                            } */}
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