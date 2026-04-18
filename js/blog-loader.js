/* Blog Loader JS — Muts Safaris */
/* API Integration Ready */
(function () {
    if (window.mutsBlogInitialized) return;
    window.mutsBlogInitialized = true;

    var BLOG_DATA_PATH = '../../data/blog-posts.json';
    var BLOG_KEY = 'muts_blog_bookmarks';
    var _apiReady = false;
    var API_BASE_URL = '/api';

    var blogData = null;
    var currentCategory = 'all';
    var currentSearch = '';
    var currentPage = 1;
    var postsPerPage = 6;

    function getSession() {
        try {
            return JSON.parse(localStorage.getItem('muts_session'));
        } catch (e) {
            return null;
        }
    }

    function getBasePath() {
        var path = window.location.pathname;
        if (path.indexOf('/pages/dashboard/blog/') !== -1) {
            return '../../../';
        }
        if (path.indexOf('/pages/dashboard/') !== -1) {
            return '../../';
        }
        return './';
    }

    function loadBlogData(callback, forceReload) {
        if (blogData && !forceReload) {
            callback(blogData);
            return;
        }
        
        if (_apiReady) {
            fetchFromAPI('/blog/posts').then(function(data) {
                blogData = { posts: data.posts || data, categories: data.categories || [], tags: data.tags || [] };
                var userPosts = JSON.parse(localStorage.getItem('muts_user_posts') || '[]');
                var publishedUserPosts = userPosts.filter(function(p) { return p.status === 'published'; });
                if (publishedUserPosts.length > 0) {
                    blogData.posts = publishedUserPosts.concat(blogData.posts);
                }
                blogData.allUserPosts = userPosts;
                callback(blogData);
            }).catch(function() {
                loadLocalData(callback);
            });
            return;
        }
        
        loadLocalData(callback);
    }

    function loadLocalData(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', getBasePath() + 'data/blog-posts.json', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        blogData = JSON.parse(xhr.responseText);
                        var userPosts = JSON.parse(localStorage.getItem('muts_user_posts') || '[]');
                        var publishedUserPosts = userPosts.filter(function(p) { return p.status === 'published'; });
                        if (publishedUserPosts.length > 0) {
                            blogData.posts = publishedUserPosts.concat(blogData.posts);
                        }
                        blogData.allUserPosts = userPosts;
                        callback(blogData);
                    } catch (e) {
                        console.error('Error parsing blog data:', e);
                        var userPosts = JSON.parse(localStorage.getItem('muts_user_posts') || '[]');
                        var publishedPosts = userPosts.filter(function(p) { return p.status === 'published'; });
                        blogData = { posts: publishedPosts, categories: [], tags: [], comments: {}, allUserPosts: userPosts };
                        callback(blogData);
                    }
                } else {
                    console.error('Error loading blog data:', xhr.status);
                    var userPosts = JSON.parse(localStorage.getItem('muts_user_posts') || '[]');
                    var publishedPosts = userPosts.filter(function(p) { return p.status === 'published'; });
                    if (publishedPosts.length > 0) {
                        blogData = { posts: publishedPosts, categories: [], tags: [], comments: {}, allUserPosts: userPosts };
                        callback(blogData);
                    } else {
                        callback(null);
                    }
                }
            }
        };
        xhr.send();
    }

    function fetchFromAPI(endpoint, options) {
        var session = getSession();
        options = options || {};
        
        var fetchOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (session && session.token) {
            fetchOptions.headers['Authorization'] = 'Bearer ' + session.token;
        }
        
        if (options.body) {
            fetchOptions.body = JSON.stringify(options.body);
        }
        
        return fetch(API_BASE_URL + endpoint, fetchOptions)
            .then(function(response) {
                if (response.status === 401) {
                    throw new Error('Session expired');
                }
                if (!response.ok) throw new Error('API error');
                return response.json();
            });
    }

    function formatDate(dateStr) {
        var date = new Date(dateStr);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function getImagePath(imageName) {
        if (!imageName) return getBasePath() + 'images/hero/kenya-safari.jpg';
        if (imageName.indexOf('data:image') !== -1) return imageName;
        if (imageName.indexOf('http') !== -1) return imageName;
        return getBasePath() + 'images/blog/' + imageName;
    }

    function getArticleImages(post) {
        if (!post) return [];
        
        var images = [];
        
        if (post.image) {
            images.push({
                src: getImagePath(post.image),
                alt: post.title,
                isHero: true
            });
        }
        
        if (post.images && Array.isArray(post.images)) {
            post.images.forEach(function(img, idx) {
                images.push({
                    src: getImagePath(img.src || img),
                    alt: img.alt || post.title,
                    isHero: false
                });
            });
        }
        
        return images;
    }

    function getPostUrl(post) {
        if (post.isUserPost) {
            return getBasePath() + 'pages/dashboard/blog/view.html?id=' + post.id;
        }
        return getBasePath() + 'pages/dashboard/blog/' + post.slug + '.html';
    }

    function createPostCard(post, isFeatured) {
        var card = document.createElement('div');
        card.className = 'listing-card' + (isFeatured ? ' featured-card' : '');
        card.dataset.id = post.id;

        var bookmarked = isBookmarked(post.id);
        var bookmarkIcon = bookmarked ? 
            '<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>' :
            '<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>';

        var interactionData = getPostLikesDislikes(post.id, post.likes, post.dislikes);

        card.innerHTML =
            '<img src="' + getImagePath(post.image) + '" alt="' + post.title + '" loading="lazy" onerror="this.src=\'../../images/hero/kenya-safari.jpg\'">' +
            '<div class="listing-card-body">' +
                '<span class="listing-badge">' + post.category + '</span>' +
                '<h3>' + post.title + '</h3>' +
                '<p>' + post.excerpt + '</p>' +
                '<div class="listing-meta">' +
                    '<span class="listing-duration">' + formatDate(post.date) + '</span>' +
                    '<span class="listing-price">' + post.readTime + ' min read</span>' +
                '</div>' +
                '<div class="card-likes-dislikes">' +
                    '<span class="card-likes interaction-btn' + (interactionData.userLiked ? ' active' : '') + '" title="Like" data-action="like">' +
                        '<svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/></svg>' +
                        '<span class="count">' + interactionData.likes + '</span>' +
                    '</span>' +
                    '<span class="card-dislikes interaction-btn' + (interactionData.userDisliked ? ' active' : '') + '" title="Dislike" data-action="dislike">' +
                        '<svg viewBox="0 0 24 24"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>' +
                        '<span class="count">' + interactionData.dislikes + '</span>' +
                    '</span>' +
                '</div>' +
                '<div class="post-card-actions">' +
                    '<button class="bookmark-btn' + (bookmarked ? ' active' : '') + '" data-post-id="' + post.id + '" title="' + (bookmarked ? 'Remove bookmark' : 'Bookmark') + '">' + bookmarkIcon + '</button>' +
                    '<button class="share-btn" data-post-slug="' + post.slug + '" data-post-title="' + post.title + '" title="Share"><svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg></button>' +
                '</div>' +
                '<a href="' + getPostUrl(post) + '" class="btn btn-primary">Read Article</a>' +
            '</div>';
        return card;
    }

    function renderPosts(posts, container, isFeaturedList) {
        container.innerHTML = '';
        if (!posts || posts.length === 0) {
            container.innerHTML = '<div class="no-posts"><p>No articles found.</p></div>';
            return;
        }
        posts.forEach(function (post) {
            container.appendChild(createPostCard(post, post.featured && isFeaturedList));
        });
        initCardActions();
    }

    function isBookmarked(postId) {
        var bookmarks = JSON.parse(localStorage.getItem(BLOG_KEY) || '[]');
        return bookmarks.indexOf(postId) !== -1;
    }

    function toggleBookmark(postId) {
        var bookmarks = JSON.parse(localStorage.getItem(BLOG_KEY) || '[]');
        var index = bookmarks.indexOf(postId);
        if (index === -1) bookmarks.push(postId);
        else bookmarks.splice(index, 1);
        localStorage.setItem(BLOG_KEY, JSON.stringify(bookmarks));
        
        if (_apiReady) {
            fetchFromAPI('/blog/posts/' + postId + '/bookmark', {
                method: index === -1 ? 'POST' : 'DELETE'
            }).catch(function() {});
        }
        
        return index === -1;
    }

    function getPostLikesDislikes(postId, defaultLikes, defaultDislikes) {
        defaultLikes = defaultLikes || 0;
        defaultDislikes = defaultDislikes || 0;
        
        var likeKey = 'muts_post_like_' + postId;
        var dislikeKey = 'muts_post_dislike_' + postId;
        
        var storedLikes = parseInt(localStorage.getItem('muts_post_likes_' + postId) || defaultLikes);
        var storedDislikes = parseInt(localStorage.getItem('muts_post_dislikes_' + postId) || defaultDislikes);
        
        return {
            likes: storedLikes,
            dislikes: storedDislikes,
            userLiked: localStorage.getItem(likeKey) === 'liked',
            userDisliked: localStorage.getItem(dislikeKey) === 'disliked'
        };
    }

    function togglePostLike(postId) {
        var likeKey = 'muts_post_like_' + postId;
        var dislikeKey = 'muts_post_dislike_' + postId;
        
        if (localStorage.getItem(likeKey) === 'liked') {
            localStorage.removeItem(likeKey);
            var current = parseInt(localStorage.getItem('muts_post_likes_' + postId) || 0);
            localStorage.setItem('muts_post_likes_' + postId, Math.max(0, current - 1));
        } else {
            localStorage.setItem(likeKey, 'liked');
            localStorage.removeItem(dislikeKey);
            var current = parseInt(localStorage.getItem('muts_post_likes_' + postId) || 0);
            localStorage.setItem('muts_post_likes_' + postId, current + 1);
            localStorage.removeItem('muts_post_dislikes_' + postId);
        }
        
        if (_apiReady) {
            fetchFromAPI('/blog/posts/' + postId + '/like', { method: 'POST' }).catch(function() {});
        }
    }

    function togglePostDislike(postId) {
        var likeKey = 'muts_post_like_' + postId;
        var dislikeKey = 'muts_post_dislike_' + postId;
        
        if (localStorage.getItem(dislikeKey) === 'disliked') {
            localStorage.removeItem(dislikeKey);
            var current = parseInt(localStorage.getItem('muts_post_dislikes_' + postId) || 0);
            localStorage.setItem('muts_post_dislikes_' + postId, Math.max(0, current - 1));
        } else {
            localStorage.setItem(dislikeKey, 'disliked');
            localStorage.removeItem(likeKey);
            var current = parseInt(localStorage.getItem('muts_post_dislikes_' + postId) || 0);
            localStorage.setItem('muts_post_dislikes_' + postId, current + 1);
            localStorage.removeItem('muts_post_likes_' + postId);
        }
        
        if (_apiReady) {
            fetchFromAPI('/blog/posts/' + postId + '/dislike', { method: 'POST' }).catch(function() {});
        }
    }

    function handleInteraction(postId, action) {
        if (action === 'like') {
            togglePostLike(postId);
        } else if (action === 'dislike') {
            togglePostDislike(postId);
        }
    }

    function initCardActions() {
        document.querySelectorAll('.bookmark-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var postId = btn.dataset.postId;
                var isActive = toggleBookmark(postId);
                btn.classList.toggle('active', isActive);
                btn.innerHTML = isActive ?
                    '<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>' :
                    '<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>';
            });
        });

        document.querySelectorAll('.interaction-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var card = btn.closest('.listing-card');
                var postId = card.dataset.id;
                var action = btn.dataset.action;
                handleInteraction(postId, action);
                
                if (blogData) {
                    var postsToShow = filterPosts(blogData.posts, currentCategory, currentSearch);
                    var blogContainer = document.getElementById('blog-posts-container');
                    if (blogContainer) {
                        renderPosts(postsToShow, blogContainer, false);
                    }
                }
            });
        });

        document.querySelectorAll('.share-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                sharePost(btn.dataset.postSlug, btn.dataset.postTitle);
            });
        });
    }

    function filterPosts(posts, category, search) {
        var filtered = posts || [];
        if (category && category !== 'all') {
            filtered = filtered.filter(function (p) {
                return p.category.toLowerCase().replace(' ', '-') === category;
            });
        }
        if (search) {
            var q = search.toLowerCase();
            filtered = filtered.filter(function (p) {
                return p.title.toLowerCase().indexOf(q) !== -1 || p.excerpt.toLowerCase().indexOf(q) !== -1;
            });
        }
        return filtered;
    }

    function sharePost(slug, title) {
        var url = window.location.origin + getBasePath() + 'pages/dashboard/blog/' + slug + '.html';
        if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(function () {});
        } else {
            prompt('Copy this link to share:', url);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var blogContainer = document.getElementById('blog-posts-container');
        var categoryTabs = document.getElementById('category-tabs');
        var searchInput = document.getElementById('blog-search');

        loadBlogData(function (data) {
            if (!data) return;

            if (categoryTabs) {
                var cats = [{ name: 'All', slug: 'all' }].concat(data.categories);
                cats.forEach(function (cat) {
                    var tab = document.createElement('button');
                    tab.className = 'category-tab' + (cat.slug === 'all' ? ' active' : '');
                    tab.textContent = cat.name;
                    tab.dataset.category = cat.slug;
                    tab.onclick = function() {
                        document.querySelectorAll('.category-tab').forEach(function(t) { t.classList.remove('active'); });
                        tab.classList.add('active');
                        currentCategory = cat.slug;
                        renderPosts(filterPosts(data.posts, currentCategory, currentSearch), blogContainer, false);
                    };
                    categoryTabs.appendChild(tab);
                });
            }

            if (blogContainer) {
                renderPosts(filterPosts(data.posts, currentCategory, currentSearch), blogContainer, false);
            }
        });

        if (searchInput) {
            searchInput.oninput = function() {
                currentSearch = searchInput.value;
                if (blogData) {
                    renderPosts(filterPosts(blogData.posts, currentCategory, currentSearch), blogContainer, false);
                }
            };
        }

        // Auto-refresh every 30 seconds
        var refreshInterval = setInterval(function() {
            loadBlogData(function(data) {
                if (!data || !blogContainer) return;
                renderPosts(filterPosts(data.posts, currentCategory, currentSearch), blogContainer, false);
                if (categoryTabs) {
                    var cats = [{ name: 'All', slug: 'all' }].concat(data.categories);
                    categoryTabs.innerHTML = '';
                    cats.forEach(function (cat) {
                        var tab = document.createElement('button');
                        tab.className = 'category-tab' + (cat.slug === currentCategory ? ' active' : '');
                        tab.textContent = cat.name;
                        tab.dataset.category = cat.slug;
                        tab.onclick = function() {
                            document.querySelectorAll('.category-tab').forEach(function(t) { t.classList.remove('active'); });
                            tab.classList.add('active');
                            currentCategory = cat.slug;
                            renderPosts(filterPosts(data.posts, currentCategory, currentSearch), blogContainer, false);
                        };
                        categoryTabs.appendChild(tab);
                    });
                }
            }, true);
        }, 30000);

        // Clean up on page unload
        window.addEventListener('beforeunload', function() {
            clearInterval(refreshInterval);
        });
    });

    window.MutsBlog = {
        loadData: function(callback, force) { loadBlogData(callback, force); },
        renderPosts: function(posts, container) { renderPosts(posts, container, false); },
        createPostCard: createPostCard,
        initCardActions: initCardActions,
        isBookmarked: isBookmarked,
        toggleBookmark: toggleBookmark,
        getPostLikesDislikes: getPostLikesDislikes,
        togglePostLike: togglePostLike,
        togglePostDislike: togglePostDislike,
        share: sharePost,
        getImagePath: getImagePath,
        getArticleImages: getArticleImages,
        formatDate: formatDate,
        getUserPosts: function() {
            // Get posts for current logged-in user
            var user = window.MutsAuth ? window.MutsAuth.getSession() : null;
            if (!user || !blogData || !blogData.posts) return [];
            var userId = user.id || user.email || user.name;
            return blogData.posts.filter(function(p) {
                return p.author === userId || p.authorName === userId;
            });
        },
        getAllPosts: function() {
            return blogData ? blogData.posts : [];
        },
        getRelated: function(slug, limit) {
            if (!blogData || !blogData.posts) return [];
            return blogData.posts.filter(function(p) { return p.slug !== slug; }).slice(0, limit);
        },
        renderComments: function(slug, container) {
            if (!blogData || !blogData.comments || !blogData.comments[slug]) {
                container.innerHTML = '<div class="no-comments"><p>No comments yet. Be the first to share your thoughts!</p></div>';
                return;
            }
            var comments = blogData.comments[slug];
            var html = '<h3>Comments (' + comments.length + ')</h3>';
            comments.forEach(function(c) {
                html += '<div class="comment"><div class="comment-author">' + c.author + '</div>';
                html += '<div class="comment-text">' + c.text + '</div>';
                html += '<div class="comment-date">' + formatDate(c.date) + '</div></div>';
            });
            container.innerHTML = html;
        },
        enableAPI: function(baseURL) {
            _apiReady = true;
            if (baseURL) API_BASE_URL = baseURL;
            console.log('[MutsBlog] API mode enabled');
        },
        disableAPI: function() {
            _apiReady = false;
        },
        isAPILive: function() {
            return _apiReady;
        }
    };
})();
