// Page protection indicators
// jshint jquery:true, esversion:5
/* globals require, module, mediaWiki, mw, OO */
'use strict';

function getImageThumbnailURL(name, store) {
    var encodedName = mw.util.wikiUrlencode(name);
    return "/media/"
        + store
        + "/"
        + encodedName
}

function mimicIndicator(id, link, imgName, imgStore, title) {
    var encodedLink = mw.util.getUrl(link);
    return $("<div>")
        .attr("id", "mw-indicator-" + id)
        .addClass("mw-indicator")
        .append($("<a>")
            .attr({
                "href": encodedLink,
                "title": title
            }).append($("<img>")
                .attr({
                    "alt": title,
                    "src": getImageThumbnailURL(imgName, imgStore),
                    "width": "25",
                    "height": "25"
                })
            )
        );
}

$(function () {
    var protectionLevelData = mw.config.get("wgRestrictionEdit");
    if (protectionLevelData === null) {
        // Null on nonexistent or special pages. Avoids a crash there.
        return;
    }
    if (mw.config.get("wgAction") !== "view") {
        // No need to display the indicator when viewing history or editing the page
        return;
    }
    if (mw.config.get("wgIsMainPage")) {
        // The indicator lock breaks formatting on the main page due to the level 1 header being hidden
        return;
    }

    var protectionLevel = protectionLevelData[0];
    var namespaceNumber = mw.config.get("wgNamespaceNumber")
    if (protectionLevel === "autoconfirmed") {
        mimicIndicator(
            "protection-semi",
            "Minecraft Wiki:自动确认用户",
            "Semi-protected page lock.svg",
            "6/6a",
            "此页面被半保护，只有注册用户可以编辑。"
        ).appendTo($(".mw-indicators"));
    } else if (protectionLevel === "sysop") {
        if (namespaceNumber == 6) {
            mimicIndicator(
                "protection-full",
                "Minecraft Wiki:管理员",
                "Upload protected page lock.svg",
                "7/77",
                "此文件被全保护，只有管理员可以上传。"
            ).appendTo($(".mw-indicators"));
        } else {
            mimicIndicator(
                "protection-full",
                "Minecraft Wiki:管理员",
                "Fully-protected page lock.svg",
                "b/b4",
                "此页面被全保护，只有管理员可以编辑。"
            ).appendTo($(".mw-indicators"));
        }
    }
});