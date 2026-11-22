const ANALYTICS_HOST = "https://analytics.manaiakalani.info/api/script.js";
const ANALYTICS_SITE_ID = "769ffdf97a59";

const ALLOWED_HOSTNAMES = [
  "manaiakalani.github.io",
  "cards.tinyinternet.company",
  "black-mushroom-0413a011e.5.azurestaticapps.net",
];

const SITE_ID_PATTERN = /^[a-f0-9]{12}$/;
const SCRIPT_SRC_PATTERN =
  /^https:\/\/analytics\.manaiakalani\.info\/api\/script\.js$/;
const HOSTNAME_PATTERN = /^[a-z0-9.-]+$/;

const ANALYTICS_LOADER = String.raw`(function(){var el=document.currentScript||document.getElementById("analytics-config");if(!el)return;var host=el.getAttribute("data-host")||"";var siteId=el.getAttribute("data-site-id")||"";var hosts=(el.getAttribute("data-hosts")||"").split(",");if(!/^https:\/\/analytics\.manaiakalani\.info\/api\/script\.js$/.test(host))return;if(!/^[a-f0-9]{12}$/.test(siteId))return;if(hosts.indexOf(location.hostname)===-1)return;var nodes=document.getElementsByTagName("script");for(var i=0;i<nodes.length;i++){if(nodes[i].getAttribute("src")===host)return;}var s=document.createElement("script");s.src=host;s.defer=true;s.setAttribute("data-site-id",siteId);document.head.appendChild(s);})();`;

function getAnalyticsConfig() {
  if (!SCRIPT_SRC_PATTERN.test(ANALYTICS_HOST)) {
    return null;
  }
  if (!SITE_ID_PATTERN.test(ANALYTICS_SITE_ID)) {
    return null;
  }
  const hosts = ALLOWED_HOSTNAMES.filter((hostname) =>
    HOSTNAME_PATTERN.test(hostname),
  );
  if (hosts.length === 0) {
    return null;
  }
  return {
    host: ANALYTICS_HOST,
    siteId: ANALYTICS_SITE_ID,
    hosts,
  };
}

export function Analytics() {
  const config = getAnalyticsConfig();
  if (!config) {
    return null;
  }

  return (
    <script
      id="analytics-config"
      data-host={config.host}
      data-site-id={config.siteId}
      data-hosts={config.hosts.join(",")}
      dangerouslySetInnerHTML={{ __html: ANALYTICS_LOADER }}
    />
  );
}
