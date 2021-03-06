<template>
  <div class="recommend">
    <scroll class="recommend-wrap" :data="descList" ref="recommend">
      <div>
        <div class="banner" v-if="slideList.length">
          <slider>
            <div class="swiper-slide" v-for="item in slideList" :key="item.id">
              <a :href="item.linkUrl" ><img @load="imgLoad" :src="item.picUrl" alt="" /></a> 
            </div>
          </slider>
        </div>

        <div class="descLists">
          <h2>热门歌单推荐</h2>
          <ul class="descLists-wrap">
            <li v-for="(desc, index) in descList" :key="desc.contend_id" @click="selectItem(desc, index)" >
              <div class="desc-icon">
                <img v-lazy="desc.cover" alt="desc-icon" width="60" height="60" />
              </div>
              <div class="text">
                <h3 class="desc-name">{{ desc.title }}</h3>
                <p class="listen-number">
                  播放量：{{ getListenNum(desc.listen_num) }}万
                </p>
              </div>
            </li>
          </ul>
          <div class="loading-wrap" v-show="!descList.length">
            <loading></loading>
          </div>
        </div>
      </div>
    </scroll>
    <transition name="slide-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Mixins } from "vue-property-decorator"
import { getRecommend, getDescLists } from "api/recommend"
import { ERR_OK } from "api/config"
import Slider from "components/slider/slider.vue"
import Scroll from "base/scroll/scroll.vue"
import Loading from "base/loading/loading.vue"
import { PlaylistMixin } from "common/js/mixins"
import { Mutation } from "vuex-class"
import { mapGetters, MutationMethod } from "vuex"

@Component({
  components: { Slider, Scroll, Loading }
})
export default class Recommend extends Mixins(PlaylistMixin) {
  slideList = []
  descList = []
  timer = 0
  $refs!: {
    rank: Scroll
    descLists: HTMLElement
    recommend: Scroll
    banner: HTMLElement
  }

  @Mutation("SET_DISC") setDisc!: MutationMethod

  created() {
    this.timer = window.setTimeout(() => {
      this.__getRecommend()
      this.__getDescLists()
    }, 20) //instead of nextTick(),浏览器刷新时间一般是17ms
  }
  mounted() {
    window.onresize = this.descListRefresh //resize 更新位置
  }
  destroyed() {
    window.clearTimeout(this.timer)
  }

  descListRefresh() {
    if (this.$refs.banner) {
      this.$refs.descLists.style.top = `${this.$refs.banner.offsetHeight}px`
    }
  }
  selectItem(item: any, index: string) {
    this.setDisc(item)
    this.$router.push({ path: `/recommend/${item.content_id}` })
  }
  handlePlaylist() {
    const BOTTOM = this.playlist.length ? 45 : 0
    if (this.$refs.recommend) {
      this.$refs.recommend.$el.style.bottom = `${BOTTOM}px`
      this.$refs.recommend.refresh()
    }
  }
  __getRecommend() {
    getRecommend().then((response: any): void => {
      this.slideList = response.data.slider
    })
  }
  __getDescLists() {
    getDescLists().then((res: any) => {
      if (res.code === ERR_OK) {
        this.descList = Array.from(res["recomPlaylist"].data.v_hot)
      }
    })
  }
  getListenNum(number: string) {
    return (parseFloat(number) / 10000).toFixed(1)
  }
  imgLoad() {
    this.$refs.recommend.refresh()
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl';

.recommend
  content-position()
  // 详情进入动画
  slide-in()

  .recommend-wrap
    overflow hidden
    position absolute
    top 0
    bottom 0
    right 0
    left 0
    .banner
      position relative
      box-sizing border-box
      width 100%
      a
        display block
        box-sizing border-box
        width 100%
        overflow hidden

        &::after
          content ''
          display block
          position absolute
          top 0
          bottom 0
          left 0
          right 0
          background-color rgba(0, 0, 0, 0.4)
          z-index 0

        img
          width 100%
          display block

    .descLists
      padding-bottom 10px
      h2
        color $text-highlight-color
        font-weight normal
        padding-top 20px

      ul.descLists-wrap
        li
          font-size 12px
          margin 20px 0
          display flex
          box-sizing border-box
          padding 0px 20px

          .desc-icon
            flex 0 0 auto

            img
              width 60px
              display block
              border-radius 50%

          .text
            width 50vw
            display flex
            flex-direction column
            justify-content space-between
            color #fff
            margin-left 20px
            flex 1 0 50vw
            text-align left
            font-size 12px
            padding 2px 0

            .desc-name
              font-size 12px
              font-weight normal

            .listen-number
              font-size 12px
              color #928d8d
              display -webkit-box
              -webkit-box-orient vertical
              -webkit-line-clamp 2
              line-height 1.2
              height 2.4em
              text-overflow ellipsis
              overflow hidden

      .loading-wrap
        position absolute
        width 100%
        top 60%
        transform translateY(-50%)
        z-index 3
        @media screen and (min-width 720px){
          top 70%
        }
</style>
