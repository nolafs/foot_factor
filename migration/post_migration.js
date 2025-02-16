"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require("dotenv/config");
var axios_1 = require("axios");
var prismic = require("@prismicio/client");
var https_1 = require("https");
var migrate_1 = require("@prismicio/migrate");
var slicemachine_config_json_1 = require("./../slicemachine.config.json");
var DOMAIN = 'https://footfactor.com/';
// Prismic setup
var writeClient = prismic.createWriteClient(slicemachine_config_json_1.repositoryName, {
    writeToken: process.env.PRISMIC_WRITE_TOKEN
});
var client = prismic.createClient(slicemachine_config_json_1.repositoryName);
var migration = prismic.createMigration();
// fetch all documents from word-press API
var fetchPosts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("".concat(DOMAIN, "/wp-json/wp/v2/posts?page=1&per_page=1&_embed"), {
                        httpsAgent: new https_1.default.Agent({ rejectUnauthorized: false })
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching posts:", error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
var formatDate = function (date) {
    return new Date(date !== null && date !== void 0 ? date : Date.now()).toISOString().split('T')[0];
};
console.log("Fetching posts from WordPress API...");
var posts = await fetchPosts();
posts.forEach(function (post) { return __awaiter(void 0, void 0, void 0, function () {
    var title, content, excerpt, date, slug, _embedded, richText, excerptRichText, featuredMedia, categorySlug, tagsSlug, tagList, data, doc;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        title = post.title, content = post.content, excerpt = post.excerpt, date = post.date, slug = post.slug, _embedded = post._embedded;
        richText = (0, migrate_1.htmlAsRichText)(content.rendered, {
            serializer: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                img: function (_a) {
                    var node = _a.node;
                    var src = node.properties.src;
                    if (!src || typeof src !== "string") {
                        return null;
                    }
                    var filename = src.split("/").pop();
                    var alt = node.properties.alt;
                    if (filename) {
                        // Ensure the asset is an image
                        if (src.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                            return {
                                type: "image",
                                id: migration.createAsset(src, filename, { alt: alt }),
                            };
                        }
                        else {
                            console.error("The asset with the ID '".concat(filename, "' is not an image."));
                            return null;
                        }
                    }
                },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                a: function (_a) {
                    var node = _a.node;
                    var href = node.properties.href;
                    if (!href || typeof href !== "string") {
                        return null;
                    }
                    // Matches URLs like `/blog/hello-world`
                    if (href.startsWith("/blog/")) {
                        // e.g. `hello-world`
                        var uid_1 = href.split("/").pop();
                        if (!uid_1) {
                            return null;
                        }
                        return {
                            type: "hyperlink",
                            // Creates a content relationship to
                            // the blog post with a matching `uid`
                            data: function () { return migration.getByUID("posts", uid_1); },
                        };
                    }
                    // Serializes other links as external links
                    return "hyperlink";
                },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                iframe: function (_a) {
                    var node = _a.node;
                    var src = node.properties.src;
                    if (!src || typeof src !== "string") {
                        return null;
                    }
                    console.log("EMBED", src);
                    // Check if the embed URL has the required metadata
                    if (src.includes("www.youtube.com")) {
                        return {
                            type: "embed",
                            oembed: {
                                embed_url: "https://youtu.be/".concat(src.split("/").pop()),
                            },
                        };
                    }
                    if (src.includes("youtu.be")) {
                        return {
                            type: "embed",
                            oembed: {
                                embed_url: "https://youtu.be/".concat(src.split("/").pop()),
                            },
                        };
                    }
                    console.error("We couldn't find data for the embed url ".concat(src, ", error: 'no meta url'"));
                    return null;
                }
            },
        }).result;
        excerptRichText = (0, migrate_1.htmlAsRichText)(excerpt.rendered).result;
        featuredMedia = _embedded['wp:featuredmedia'][0];
        categorySlug = ((_c = (_b = (_a = _embedded === null || _embedded === void 0 ? void 0 : _embedded['wp:term']) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.slug) || "uncategorized";
        tagsSlug = ((_e = (_d = _embedded === null || _embedded === void 0 ? void 0 : _embedded['wp:term']) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.map(function (tag) { return tag.slug; })) || [];
        if (!excerpt.rendered) {
            excerpt.rendered = "No excerpt provided";
        }
        console.log("TAGS SLUGS", tagsSlug);
        tagList = tagsSlug.map(function (tagSlug) {
            return { tag: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var existingBarDocument;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client.getByUID("post_tags", tagSlug)];
                            case 1:
                                existingBarDocument = _a.sent();
                                return [2 /*return*/, existingBarDocument];
                        }
                    });
                }); } };
        });
        console.log("TAGS LIST", tagList);
        data = {
            title: title.rendered,
            content: richText,
            publishing_date: (_f = formatDate(date)) !== null && _f !== void 0 ? _f : undefined,
            category: function () { return __awaiter(void 0, void 0, void 0, function () {
                var existingBarDocument;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getByUID("post_category", categorySlug)];
                        case 1:
                            existingBarDocument = _a.sent();
                            return [2 /*return*/, existingBarDocument];
                    }
                });
            }); },
            tags: tagList,
            author: function () { return __awaiter(void 0, void 0, void 0, function () {
                var existingBarDocument;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getByUID("author", "foot-factory")];
                        case 1:
                            existingBarDocument = _a.sent();
                            return [2 /*return*/, existingBarDocument];
                    }
                });
            }); },
            excerpt: excerptRichText,
            feature_image: migration.createAsset(featuredMedia.source_url, featuredMedia.source_url.split("/").pop(), {
                alt: featuredMedia.title.rendered,
            }),
        };
        doc = migration.createDocument({
            type: "posts",
            lang: "en-gb",
            uid: slug,
            tags: tagsSlug,
            alternate_language_id: "en-gb",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            data: data,
        }, title.rendered);
        return [2 /*return*/];
    });
}); });
console.log("Migrating write documents...");
console.log("Migration", migration);
await writeClient.migrate(migration, {
    reporter: function (event) { return console.log(event); },
});
