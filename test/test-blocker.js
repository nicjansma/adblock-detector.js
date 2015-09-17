/* eslint-env mocha,jquery */
/* global expect,AdblockDetector */
describe("AdblockDetector - With Ad Blocker Running", function() {
    "use strict";

    describe(".detect()", function() {
        it("should detect when an ad-blocker is running", function(done) {
            AdblockDetector.detect({
                timeout: 0,
                blocked: function(element) {
                    expect(element).to.be.an("object");
                },
                complete: function(adCount, adsBlockedCount) {
                    expect(adCount).to.equal(2, "2 ads detected");
                    expect(adsBlockedCount).to.equal(2, "2 ads blocked");
                    done();
                }
            });
        });
    });

    describe("hasAdsBlocked()", function() {
        it("should return true when an ad-blocker is running", function() {
            $(".ad-container").each(function(i, element) {
                expect(AdblockDetector.hasAdsBlocked(element)).to.be.ok();
            });
        });
    });
});
