import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enquiryFilters } from '../src/lib/enquiry-filters';
test('archive defaults to all-time with no expiry filter', () => {
 assert.deepEqual(enquiryFilters({}).filter, {});
});
test('search treats regular-expression symbols as literal customer text', () => {
 const {filter}=enquiryFilters({q:'a+b.[x]($)\\'});
 const pattern=filter.$or![0].name!.$regex;
 assert.equal(new RegExp(pattern,'i').test('a+b.[x]($)\\'),true);
 assert.equal(new RegExp(pattern,'i').test('aaabXx'),false);
});
test('archive validates filters and bounds pagination', () => {
 const bad=enquiryFilters({status:'invalid',days:'-1',page:'-2'});
 assert.deepEqual(bad.filter,{}); assert.equal(bad.page,0);
 const good=enquiryFilters({status:'won',days:'365',q:'x'.repeat(200)});
 assert.equal(good.filter.status,'won'); assert.ok(good.filter.createdAt?.$gte instanceof Date); assert.equal(good.q.length,120);
});
