const dns = require('dns');

dns.lookup('google.com', (err, address) => {
  if (err) throw err;
  console.log('IP Address:', address);
});

dns.resolve4('google.com', (err, addresses) => {
  if (err) throw err;
  console.log('IPv4 Addresses:', addresses);
});

dns.reverse('8.8.8.8', (err, hostnames) => {
  if (err) throw err;
  console.log('Reverse lookup for 8.8.8.8:', hostnames);
});
