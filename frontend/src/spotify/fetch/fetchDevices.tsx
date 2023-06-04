const devicesEndpoint = "https://api.spotify.com/v1/me/player/devices";

export const fetchDevices = (userIdentifier: string) => {
  const accessToken = localStorage.getItem(`access_token_${userIdentifier}`);

  return fetch(devicesEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Devices response:", data);
      const { devices } = data;
      return devices || [];
    })
    .catch((error) => {
      console.log("Error fetching devices:", error);
      return [];
    });
};
