import { createClient } from '@supabase/supabase-js';

// log process.env
console.log(process.env);

const SUPABASE_URL='https://wzahgeiqvhsgrpgvevsw.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YWhnZWlxdmhzZ3JwZ3ZldnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU4MTA2MzYsImV4cCI6MTk4MTM4NjYzNn0.5CTMgRPzz9YI5uTbL_2Rv-oYIJeSBU-hWnFOhSLDECU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateLocation() {
  const names = ['Adams', 'Broadway', 'Central', 'Elm', 'Fourth'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const stateMappings = {
    'New York': 'NY',
    'Los Angeles': 'CA',
    'Chicago': 'IL',
    'Houston': 'TX',
    'Phoenix': 'AZ',
  };
  const zipCodes = ['10001', '90001', '60601', '77001', '85001'];

  const name = names[Math.floor(Math.random() * names.length)];
  const address = Math.floor(Math.random() * 1000) + ' ' + name + ' St.';
  const city = cities[Math.floor(Math.random() * cities.length)];
  const state = stateMappings[city]; // Get the state for the selected city
  const zip = zipCodes[Math.floor(Math.random() * zipCodes.length)];
  const phone = Math.floor(Math.random() * 10000000000).toString();
  const email = name.toLowerCase() + '@example.com';
  const lat = Math.random() * 180 - 90;
  const lng = Math.random() * 360 - 180;

  return {
    name,
    address,
    city,
    state,
    zip,
    phone,
    email,
    geom: `POINT(${lng} ${lat})`,
  };
}


async function generateLocations() {
  for (let i = 0; i < 1000; i++) {
    const location = generateLocation()

    const { data, error } = await supabase.from('locations').insert(location).select('*').single();

    if (error) {
      console.error(error)
      return
    }

    console.log(`Inserted location ${i + 1}: ${JSON.stringify(data)}`)
  }
}

generateLocations()
