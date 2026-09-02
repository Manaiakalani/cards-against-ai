const ANALYTICS_HOST = "https://analytics.manaiakalani.info/api/script.js";
const ANALYTICS_SITE_ID = "769ffdf97a59";

const ALLOWED_HOSTNAMES = [
  "manaiakalani.github.io",
  "cards.tinyinternet.company",
  "black-mushroom-0413a011e.5.azurestaticapps.net",
];

export function Analytics() {
  const allowed = JSON.stringify(ALLOWED_HOSTNAMES);
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var hosts=${allowed};if(hosts.indexOf(location.hostname)===-1)return;if(document.querySelector('script[src="${ANALYTICS_HOST}"]'))return;var s=document.createElement("script");s.src="${ANALYTICS_HOST}";s.defer=true;s.setAttribute("data-site-id","${ANALYTICS_SITE_ID}");document.head.appendChild(s);})();`,
      }}
    />
  );
}
