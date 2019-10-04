var hostname;
if (window.location && window.location.hostname) {
  hostname = window.location.hostname;
} else {
  hostname = 'thesplinks.com';
}

var localhostMap = {
  public: '3000',
  citizen: '3001',
  member: '3002',
};

var templateObj = {
  'thesplinks.com': function (api) {
    return 'https://api.thesplinks.com/' + api;
  },
  'www.splink': function (api) {
    return 'https://' + api + '.api.splink';
  },
  'www2.thesplinks.com': function (api) {
    return 'https://apiv2.thesplinks.com/' + api;
  },
  'www2.splink': function (api) {
    return 'https://' + api + '.apiv2.splink';
  },
  'www5.splink': function (api) {
    return 'https://' + api + '.apiv5.splink';
  },
  'localhost': function (api) {
    return 'http://localhost:' + localhostMap[api];
  },
};

console.log(hostname);
export default {
  endpoints: {
    publicApi: templateObj[hostname]('public'),
    citizenApi: templateObj[hostname]('citizen'),
    memberApi: templateObj[hostname]('member'),
  },
};
