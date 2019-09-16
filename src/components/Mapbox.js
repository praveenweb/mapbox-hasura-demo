import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ReactMapGL, { Marker } from "react-map-gl";

const UPDATE_AREA_MUTATION = gql`
  mutation($area: String!) {
    update_users(where:{}, _set: {area: $area}) {
      affected_rows
    }
  }
`;

const UPDATE_COORDINATES_MUTATION = gql`
  mutation($location: geography!) {
    update_users(where:{}, _set: {location: $location}) {
      affected_rows
    }
  }
`;

function ForwardGeocode({ loading, error, data }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Enter area above to get result</p>;

  if(!data.users) {
    return <p>Enter area above to get result</p>
  }

  const result = data.users[0];
  const lat = parseFloat(result.coordinates[0].lat);
  const long = parseFloat(result.coordinates[0].long);

  return (
      <div>
        <p>Name: {result.name}</p>
        <p>Area: {result.area}</p>
        <p>Lat: {lat}</p>
        <p>Long: {long}</p>
        <ReactMapGL
          width={400}
          height={400}
          latitude={lat}
          longitude={long}
          zoom={12}>
            <Marker latitude={lat} longitude={long}>
              <img className={'mapMarker'} alt="map icon" src="https://image.flaticon.com/icons/svg/33/33622.svg" />
            </Marker>
          </ReactMapGL>
      </div>
  );
}

function ReverseGeocode({loading, data, error}) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Enter coordinates above to get result</p>;
  if(!data.users) {
    return <p>Enter coordinates above to get result</p>
  }

  const result = data.users[0];
  return (
    <div>
      <p>Name: {result.name}</p>
      <p>PostGIS Location: {JSON.stringify(result.location)}</p>
      <p><b>Nearby Place:</b></p>
      <div>
        <table>
          <thead>
            <tr>
              <td><b>Place Type</b></td>
              <td><b>Place Name</b></td>
            </tr>
          </thead>
          <tbody>
             {data.users[0].places.map((place,index) => {
              return(
                <tr key={place.place_name + index}>
                  <td>{place.place_type}</td>
                  <td>{place.place_name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AreaBasedMap() {
  const [areaName,setAreaName] = useState('');
  const { loading, error, data, refetch} = useQuery(gql`
    {
      users {
        id
        name
        area
        coordinates {
          place_name
          lat
          long
        }
      }
    }
  `);

  const [updateArea] = useMutation(UPDATE_AREA_MUTATION);
  const handleSubmit = (e) => {
      // make a useMutation hook call
      e.preventDefault();
      updateArea({ variables: { area: areaName }, onCompleted: refetch });
      alert('Updated Successfully');
      refetch();
      setAreaName('');
  }
  return (
    <div className={'wd50'}>
      <h1>Forward Geocoding</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            className={"form-control forwardInput"}
            type="text" 
            value={areaName}
            onChange={e => setAreaName(e.target.value)} 
            placeholder="Enter area name" />
          <button className={'btn btn-default'} type="submit">Update</button>
        </div>
      </form>
      <ForwardGeocode loading={loading} error={error} data={data} />
    </div>
  );
}

function CoordinateBasedLocations() {
  const [lat,setLat] = useState('');
  const [long,setLong] = useState('');
  const { loading, error, data, refetch } = useQuery(gql`
  {
    users {
      id
      name
      location
      places {
        id
        place_name
        place_type
      }
    }
  }
  `);
  const [updateCoordinates] = useMutation(UPDATE_COORDINATES_MUTATION);
  const handleSubmit = (e) => {
      // make a useMutation hook call
      e.preventDefault();
      updateCoordinates({ variables: { location: { type: "Point", coordinates: [parseFloat(lat),parseFloat(long)]}}}); // no onCompleted
      alert('Updated Successfully');
      refetch();
      setLat('');
      setLong('');
  }

  return (
    <div className={'wd50'}>
      <h1>Reverse Geocoding</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            className={"form-control reverseInput"}
            type="text" 
            value={lat}
            onChange={e => setLat(e.target.value)} 
            placeholder="Enter latitude" />
          <input 
            className={"form-control reverseInput"}
            type="text" 
            value={long}
            onChange={e => setLong(e.target.value)} 
            placeholder="Enter longitude" />
          <button className={'btn btn-default'} type="submit">Update</button>
        </div>
      </form>
      <ReverseGeocode loading={loading} error={error} data={data} />
    </div>
  );
}

const Mapbox = () => (
  <div className={'geocodeWrapper'}>
    <AreaBasedMap />
    <CoordinateBasedLocations />
  </div>
);

export default Mapbox;
