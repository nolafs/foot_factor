'use client';
import React from 'react';
import {Wrapper} from "@googlemaps/react-wrapper";

interface GoogleMapWrapperProps {
    children?: React.ReactNode;
}

export const GoogleMapWrapper = ({children}: GoogleMapWrapperProps) => {

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Replace with your actual API key

    if (!apiKey) {
        return <div>Oops! Cannot display the map: Google Maps API key missing</div>;
    }


    return <Wrapper apiKey={apiKey}>{children}</Wrapper>;
}

export default GoogleMapWrapper;
