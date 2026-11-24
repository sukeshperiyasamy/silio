import { test } from "node:test";
import assert from "node:assert/strict";
import { pageMetadata, organizationSchema } from "../src/lib/seo";
import { site } from "../src/lib/site";
test("service SEO keeps canonical, sharing URL and language alternatives on the same service", () => {
  const path = "/services/business-websites-jodhpur";
  const data = pageMetadata("hi", path, {
    title: "बिज़नेस वेबसाइट | Silio",
    description: "विशिष्ट सेवा का विवरण",
  });
  assert.equal(data.alternates?.canonical, site.url + "/hi" + path);
  assert.equal(data.openGraph?.url, site.url + "/hi" + path);
  assert.equal(data.openGraph?.description, data.description);
  assert.equal(
    data.alternates?.languages?.["x-default"],
    site.url + "/en" + path,
  );
  assert.equal(data.alternates?.languages?.en, site.url + "/en" + path);
  assert.ok(
    JSON.stringify(data.openGraph?.images).includes("social-card-hi.png"),
  );
});
test("directory and privacy get distinct descriptions and consistent share cards", () => {
  const services = pageMetadata("en", "/services", { title: "Services" });
  const privacy = pageMetadata("en", "/privacy", { title: "Privacy" });
  assert.notEqual(services.description, privacy.description);
  assert.ok(String(privacy.description).includes("enquiry"));
  assert.ok(JSON.stringify(services.twitter).includes("summary_large_image"));
  assert.ok(JSON.stringify(services.openGraph?.images).includes("1200"));
  const schema = organizationSchema();
  assert.equal(schema.url, site.url);
  assert.equal(schema.name, "Silio");
});
