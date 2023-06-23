// ==UserScript==
// @name       v2ex-reaciton
// @namespace  npm/vite-plugin-monkey
// @version    0.0.0
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      *://*.v2ex.com/t/*
// @require    https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// ==/UserScript==

(r=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=r,document.head.append(e)})(' :root{--emojir-text-primary: #24292f }@media (prefers-color-scheme: dark){:root{--emojir-text-primary: #f5f5f5}}.emoji-reaction{display:flex;flex-direction:column;align-items:center;gap:1rem;margin:1rem 0;flex-wrap:wrap}.emoji-title{font-size:14px;font-weight:600;color:var(--emojir-text-primary)}.emoji-face-icon:before,.emoji-face-icon::-webkit-details-marker{display:none}.emoji-face-icon::marker{content:""}.emoji-list{display:flex;gap:5px}.emoji-menu{position:relative;background:#F6F8FA;border:1px solid #D0D7DE;border-radius:50%;width:24px;height:24px;cursor:pointer}.emoji-panel{padding:.5rem;border:1px solid #e1e4e8;position:absolute;z-index:10;background-color:#fff;border-radius:.5rem;box-shadow:0 0 10px #0000001a;display:flex;flex-wrap:wrap;gap:.3rem;width:9rem;transition:all 5.2s ease-in-out}.emoji-item{padding:.5rem;width:1rem;height:1rem;cursor:pointer;border-radius:3px;display:flex;justify-content:center;align-items:center}.emoji-item:hover{background:#f3f4f6;font-size:20px;transition:font-size .2s ease-in-out}.emoji-item-reacted{background:#ddf4ff}.emoji-counter{padding:0 4px;font-size:12px;border-radius:100px;background:red;height:24px;width:40px;line-height:24px;background:#fff;border:1px solid #d1d5db;cursor:pointer}.emoji-counter:hover{background:#eaeef2}.emoji-counter-reacted{background:#ddf4ff;border:1px solid #0969DA}.emoji-counter-reacted:hover{background:#B6E3FF} ');

(function (vue) {
  'use strict';

  function getSearchParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }
  const token = vue.ref("");
  function useAuth() {
    const isAuth = vue.ref(false);
    const authURL = vue.ref("");
    async function genAuthURL() {
      const href = window.location.href;
      const response = await fetch(`https://v2ex-reaction.vercel.app/authorize?app_return_url=${href}`);
      const data = await response.text();
      authURL.value = data;
    }
    function setToken() {
      const emoji_token = getSearchParam("emoji-reaction-token") || localStorage.getItem("emoji-reaction-token");
      if (emoji_token) {
        localStorage.setItem("emoji-reaction-token", emoji_token);
        token.value = emoji_token;
        isAuth.value = true;
      }
    }
    setToken();
    return {
      genAuthURL,
      authURL,
      token,
      isAuth
    };
  }
  const emojiMap = {
    THUMBS_UP: "👍",
    THUMBS_DOWN: "👎",
    LAUGH: "😄",
    HOORAY: "🎉",
    CONFUSED: "😕",
    HEART: "❤️",
    ROCKET: "🚀",
    EYES: "👀"
  };
  const reactions = vue.ref([]);
  const subjectId = vue.ref("");
  const filteredReactions = vue.computed(() => {
    return reactions.value.filter((reaction) => reaction.totalCount > 0);
  });
  const totalCount = vue.computed(() => {
    return filteredReactions.value.reduce((total, reaction) => {
      return total + reaction.totalCount;
    }, 0);
  });
  function useReaction() {
    async function getReaction() {
      const token2 = localStorage.getItem("emoji-reaction-token");
      const response = await fetch(`https://v2ex-reaction.vercel.app/getDiscussion?token=${token2}`);
      const data = await response.json();
      const reactionGroups = data.response.data.repository.discussion.reactionGroups;
      const discussionId = data.response.data.repository.discussion.id;
      subjectId.value = discussionId;
      reactions.value = reactionGroups.map((reaction) => {
        return {
          content: reaction.content,
          totalCount: reaction.users.totalCount,
          viewerHasReacted: reaction.viewerHasReacted,
          emoji: emojiMap[reaction.content]
        };
      });
    }
    const TOGGLE_REACTION_QUERY = (mode) => `
  mutation($content: ReactionContent!, $subjectId: ID!) {
    toggleReaction: ${mode}Reaction(input: {content: $content, subjectId: $subjectId}) {
      reaction {
        content
        id
      }
    }
  }`;
    async function clickReaction(content, token2, viewerHasReacted) {
      try {
        await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token2}`
          },
          body: JSON.stringify({
            query: TOGGLE_REACTION_QUERY(viewerHasReacted ? "remove" : "add"),
            variables: {
              subjectId: subjectId.value,
              content
            }
          })
        });
        await getReaction();
      } catch (error) {
        console.log(error);
      }
    }
    return {
      reactions,
      getReaction,
      filteredReactions,
      totalCount,
      clickReaction
    };
  }
  const _hoisted_1$1 = { class: "emoji-list" };
  const _hoisted_2$1 = { class: "emoji-face-icon" };
  const _hoisted_3$1 = {
    "aria-hidden": "true",
    focusable: "false",
    role: "img",
    viewBox: "0 0 16 16",
    width: "16",
    height: "16",
    fill: "currentColor",
    style: { "display": "inline-block", "user-select": "none", "vertical-align": "text-bottom", "overflow": "visible" }
  };
  const _hoisted_4$1 = /* @__PURE__ */ vue.createElementVNode("path", { d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm3.82 1.636a.75.75 0 0 1 1.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 0 1 1.222.87l-.022-.015c.02.013.021.015.021.015v.001l-.001.002-.002.003-.005.007-.014.019a2.066 2.066 0 0 1-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.331 3.331 0 0 1-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 0 1 .183-1.044ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.25 2.25.592.416a97.71 97.71 0 0 0-.592-.416Z" }, null, -1);
  const _hoisted_5$1 = [
    _hoisted_4$1
  ];
  const _hoisted_6 = { class: "emoji-panel" };
  const _hoisted_7 = ["onClick"];
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Menu",
    props: {
      reactions: {
        type: Array,
        required: true
      }
    },
    setup(__props) {
      const { clickReaction } = useReaction();
      const { token: token2 } = useAuth();
      const emojiPanelRef = vue.ref(null);
      const vClickOutside = {
        beforeMount(el, binding) {
          el.clickOutsideEvent = function(event) {
            if (!(el === event.target || el.contains(event.target)))
              binding.value(event);
          };
          document.addEventListener("mousedown", el.clickOutsideEvent);
        },
        beforeUnmount(el) {
          document.removeEventListener("mousedown", el.clickOutsideEvent);
        }
      };
      function handleClickOutside() {
        emojiPanelRef.value.open = false;
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.withDirectives((vue.openBlock(), vue.createElementBlock("details", {
            ref_key: "emojiPanelRef",
            ref: emojiPanelRef,
            class: "emoji-menu"
          }, [
            vue.createElementVNode("summary", _hoisted_2$1, [
              (vue.openBlock(), vue.createElementBlock("svg", _hoisted_3$1, _hoisted_5$1))
            ]),
            vue.createElementVNode("div", _hoisted_6, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.reactions, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: index,
                  class: vue.normalizeClass([[item.viewerHasReacted ? "emoji-item-reacted" : ""], "emoji-item"]),
                  onClick: ($event) => vue.unref(clickReaction)(item.content, vue.unref(token2), item.viewerHasReacted)
                }, vue.toDisplayString(item.emoji), 11, _hoisted_7);
              }), 128))
            ])
          ])), [
            [vClickOutside, handleClickOutside]
          ])
        ]);
      };
    }
  });
  const _hoisted_1 = { class: "emoji-reaction" };
  const _hoisted_2 = { key: 0 };
  const _hoisted_3 = { class: "emoji-title" };
  const _hoisted_4 = { class: "emoji-list" };
  const _hoisted_5 = ["onClick"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const { reactions: reactions2, getReaction, filteredReactions: filteredReactions2, totalCount: totalCount2, clickReaction } = useReaction();
      const { genAuthURL, authURL, isAuth, token: token2 } = useAuth();
      function init() {
        if (!isAuth.value)
          genAuthURL();
        else
          getReaction();
      }
      vue.onMounted(() => {
        init();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          !vue.unref(isAuth) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, vue.toDisplayString(vue.unref(authURL)), 1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_3, vue.toDisplayString(vue.unref(totalCount2)) + "个反应 ", 1),
          vue.createElementVNode("div", _hoisted_4, [
            vue.createVNode(_sfc_main$1, { reactions: vue.unref(reactions2) }, null, 8, ["reactions"]),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(filteredReactions2), (item, index) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: index,
                class: vue.normalizeClass([item.viewerHasReacted ? "emoji-counter-reacted" : "", "emoji-counter"]),
                onClick: ($event) => vue.unref(clickReaction)(item.content, vue.unref(token2), item.viewerHasReacted)
              }, vue.toDisplayString(item.emoji) + " " + vue.toDisplayString(item.totalCount), 11, _hoisted_5);
            }), 128))
          ])
        ]);
      };
    }
  });
  vue.createApp(_sfc_main).mount(
    (() => {
      const emojiApp = document.createElement("div");
      emojiApp.id = "emoji-reaction";
      const parentEL = document.querySelector("#Main > .box");
      const topicBtnEl = document.querySelector(".topic_buttons");
      parentEL.insertBefore(emojiApp, topicBtnEl);
      return emojiApp;
    })()
  );

})(Vue);
