/* eslint-env mocha,jquery */
/* global expect,AdblockDetector */
describe("AdblockDetector - No Ad Blocker", function() {
    "use strict";

    describe(".detect()", function() {
        it("should detect no ads when no ad-blocker is running", function(done) {
            AdblockDetector.detect({
                timeout: 1500,
                blocked: function() {
                    expect().fail("blocked callback should never fire");
                },
                complete: function(adCount, adsBlockedCount) {
                    expect(adCount).to.equal(2, "2 ads detected");
                    expect(adsBlockedCount).to.equal(0, "0 ads blocked");
                    done();
                }
            });
        });
    });

    describe("hasAdsBlocked()", function() {
        it("should return false when no ad-blocker is running", function() {
            $(".ad-container").each(function(i, element) {
                expect(AdblockDetector.hasAdsBlocked(element)).to.not.be.ok();
            });
        });
    });
});
