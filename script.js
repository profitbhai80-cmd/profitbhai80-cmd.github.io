/* Appliance Error Codes & Troubleshooting — site behaviour (vanilla JS, no libraries).
   Data source: data/codes.json. Each page sets window.SITE_BASE to "" (root),
   "../" (one level deep) or "../../" (detail pages) before this script loads. */
(function () {
  "use strict";
  var BASE = window.SITE_BASE || "";
  var entriesCache = null;

  function normalizeCode(v) {
    return (v || "").toString().trim().toUpperCase().replace(/[\s-]+/g, "");
  }
  function entryCodeNorm(e) { return normalizeCode(e.code); }

  function loadData(cb) {
    if (entriesCache) { cb(entriesCache); return; }
    fetch(BASE + "data/codes.json")
      .then(function (r) { if (!r.ok) throw new Error("data load failed"); return r.json(); })
      .then(function (json) { entriesCache = json.entries || []; cb(entriesCache); })
      .catch(function () { cb(entriesCache || []); });
  }

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- shared search / filter logic ---------- */
  function currentFilters(scope) {
    scope = scope || document;
    var codeEl = scope.querySelector("[data-filter-code]");
    var catEl = scope.querySelector("[data-filter-category]");
    var brandEl = scope.querySelector("[data-filter-brand]");
    return {
      code: codeEl ? normalizeCode(codeEl.value) : "",
      category: catEl ? catEl.value : "",
      brand: brandEl ? brandEl.value : "",
      fixedCategory: scope.getAttribute ? (scope.getAttribute("data-fixed-category") || "") : ""
    };
  }

  function matches(e, f) {
    if (f.fixedCategory && e.category !== f.fixedCategory) return false;
    if (f.category && e.category !== f.category) return false;
    if (f.brand && e.brand !== f.brand) return false;
    if (f.code && entryCodeNorm(e) !== f.code) return false; /* exact code match only */
    return true;
  }

  function renderResults(container, list, f) {
    container.innerHTML = "";
    if (!list.length) {
      var empty = document.createElement("div");
      empty.className = "no-results";
      empty.innerHTML = "<strong>No matching guide found.</strong><br>" +
        "Check the code exactly as shown on your appliance display, or clear the filters and browse by category. " +
        "New guides are added only after the code's meaning is verified against the manufacturer manual, so some codes are not covered yet.";
      container.appendChild(empty);
      return;
    }
    list.forEach(function (e) {
      var card = document.createElement("div");
      card.className = "result-card";
      var badge = e.status === "verified"
        ? '<span class="badge verified">Guide available</span>'
        : '<span class="badge planned">Guide in preparation</span>';
      var title = e.brand + " " + e.appliance + " — Error Code " + e.code;
      var head = e.status === "verified" && e.path
        ? '<h3><a href="' + BASE + e.path + '">' + title + "</a> " + badge + "</h3>"
        : "<h3>" + title + " " + badge + "</h3>";
      var body = e.status === "verified"
        ? "<p>" + (e.meaning || "") + "</p>"
        : "<p>This code is in our research queue. Its meaning will be published only after verification against the manufacturer manual — we do not guess.</p>";
      card.innerHTML = head + body;
      container.appendChild(card);
    });
  }

  function setupSearch(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    var scope = form.closest("[data-search-scope]") || form;
    var results = scope.querySelector("[data-results]") || document.querySelector("[data-results]");
    var clearBtn = form.querySelector("[data-clear]");

    function run() {
      var f = currentFilters(scope);
      loadData(function (entries) {
        var list = entries.filter(function (e) { return matches(e, f); });
        /* verified guides first, then planned */
        list.sort(function (a, b) {
          if (a.status === b.status) return 0;
          return a.status === "verified" ? -1 : 1;
        });
        renderResults(results, list, f);
        results.classList.remove("hidden");
      });
    }
    form.addEventListener("submit", function (ev) { ev.preventDefault(); run(); });
    var selects = form.querySelectorAll("select");
    for (var i = 0; i < selects.length; i++) {
      selects[i].addEventListener("change", function () { if (results && !results.classList.contains("hidden")) run(); });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        form.reset();
        if (results) { results.innerHTML = ""; results.classList.add("hidden"); }
        var codeEl = form.querySelector("[data-filter-code]");
        if (codeEl) codeEl.focus();
      });
    }
    /* Category pages: show this category's entries immediately. */
    if (scope.getAttribute && scope.getAttribute("data-fixed-category")) {
      loadData(function () { run(); });
    }
  }

  setupSearch("site-search");       /* homepage + browse-all page */
  setupSearch("category-search");   /* category pages */

  /* Homepage: populate "Recently Added Guides" from data (progressive enhancement
     over the static cards already in the HTML). */
  var recent = document.getElementById("recent-guides");
  if (recent) {
    loadData(function (entries) {
      var verified = entries.filter(function (e) { return e.status === "verified" && e.path; }).slice(0, 6);
      if (!verified.length) return;
      recent.innerHTML = "";
      verified.forEach(function (e) {
        var a = document.createElement("a");
        a.className = "card";
        a.href = BASE + e.path;
        a.innerHTML = '<span class="code-chip">' + e.code + "</span>" +
          "<h3>" + e.brand + " " + e.appliance + " Error " + e.code + "</h3>" +
          "<p>" + (e.meaning || "") + "</p>";
        recent.appendChild(a);
      });
    });
  }
})();
