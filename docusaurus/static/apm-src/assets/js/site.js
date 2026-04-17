const NAV = [
  // Updated navigation with Application Map
  {title:'', items:[{title:'Getting Started', href:'pages/getting-started.html'}]},
  {title:'', items:[{title:"What's New", href:'pages/whats-new.html'}]},
  {title:'', items:[{title:'Release Notes', href:'pages/release-notes.html'}]},
  {title:'IMPLEMENTATION GUIDES', items:[{title:'Instrumentation', href:'pages/implementation.html'}]},
  {title:'FEATURES & CAPABILITIES', items:[{title:'Auto Discovery', href:'pages/auto-discovery.html'},{title:'Auto Instrumentation', href:'pages/auto-instrumentation.html'},{title:'Dashboards', href:'pages/dashboards.html'},{title:'Distributed Tracing', href:'pages/features.html'},{title:'Application Map', href:'pages/application-map.html'},{title:'Performance Analytics', href:'pages/performance-analytics.html'},{title:'Searching and analyzing spans', href:'pages/searching-spans.html'},{title:'Service Level Objectives (SLOs)', href:'pages/slos.html'},{title:'Synthetic Monitoring (Canaries)', href:'pages/synthetic-monitoring.html'},{title:'RUM', href:'pages/rum.html'},{title:'Generative AI observability', href:'pages/generative-ai.html'}]},
  {title:'EXAMPLES & CODE SAMPLES', items:[{title:'Examples', href:'pages/examples.html'}]},
  {title:'API REFERENCE', items:[{title:'REST APIs', href:'pages/api.html'},{title:'SDK Reference', href:'pages/sdk-reference.html'}]},
  {title:'BEST PRACTICES', items:[{title:'Instrumentation Best Practices', href:'pages/best-practices.html'}]},
  {title:'TROUBLESHOOTING', items:[{title:'Common Issues', href:'pages/troubleshooting.html'},{title:'Debugging Guides', href:'pages/debugging.html'}]},
  {title:'SECURITY & COMPLIANCE', items:[{title:'Security', href:'pages/security.html'}]},
  {title:'INTEGRATIONS', items:[{title:'AWS Services', href:'pages/integrations.html'}]},
  {title:'REFERENCE', items:[{title:'Service Limits', href:'pages/reference.html'}]},
  {title:'', items:[{title:'Contributors', href:'pages/contributors.html'}]}
];

const IN_PAGES_DIR = typeof location !== 'undefined' && location.pathname.includes('/pages/');
const ASSET_PREFIX = IN_PAGES_DIR ? '../' : '';

function navHref(href) {
  if (!IN_PAGES_DIR) return href;
  return href.replace(/^pages\//, '');
}

function buildNav(){
  const container=document.getElementById('left-nav');
  NAV.forEach(group=>{
    const g=document.createElement('div');g.className='nav-group';
    if (group.title) {
      const h=document.createElement('h3');h.textContent=group.title;g.appendChild(h);
    }
    group.items.forEach(it=>{
      const a=document.createElement('a');a.className=group.title ? 'nav-item nav-sub' : 'nav-item';a.href=navHref(it.href);a.textContent=it.title;
      a.addEventListener('click',e=>{ /* let link navigate normally */ });
      g.appendChild(a);
    });
    container.appendChild(g);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  buildNav();
});

