const API = "https://api.spaceflightnewsapi.net/v3/";

async function getApi() {
  const fetchData = await fetch(`${API}articles?_limit=10`);
  const data = await fetchData.json()
  return data
}

const data = getApi()

//?_limit=100