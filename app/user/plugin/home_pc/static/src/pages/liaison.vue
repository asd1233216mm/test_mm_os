<template>
	<main id="user_liaison">
		<link :href="url" rel="stylesheet" type="text/css" />
		<div>
			<div class="liaison">
				<div class="liaison_card" v-for="(o, idx) in list" :key="idx" :class="{'active': select == idx}">

					<div class="frame">
						<a @click="get_card(o.card_id)">
							<!-- :href="'./card?card_id=' + o.card_id" -->
							<img v-if="o.portrait" class="portrait" :src="o.portrait" :alt="o.portrait" />
							<span v-if="!o.portrait" class="portrait center">无图像</span>
						</a>
					</div>

					<div class="content">

						<div class="name">
							<span>姓名:</span>
							<span>{{o.name}}</span>
						</div>

						<div class="job">
							<span>职位:</span>
							<span>{{o.job}}</span>
						</div>

					</div>

				</div>
			</div>

			<div class="card" v-show="card_show">

				<div class="logo" v-if="card.logo">
					<img :src="card.logo" width="5rem" height="5rem" />
				</div>

				<div class="portrait" v-if="card.portrait">
					<img :src="card.portrait" width="5rem" height="5rem" />
				</div>

				<div class="name">
					<span class="prefix">姓名： </span>
					<span class="content">{{card.name}}</span>
				</div>

				<div class="work_extent">
					<span class="prefix">职务： </span>
					<span class="content">{{card.work_extent}}</span>
				</div>

				<div class="phone">
					<span class="prefix">电话： </span>
					<span class="content">{{card.phone}}</span>
				</div>

				<div class="qq">
					<span class="prefix">QQ： </span>
					<span class="content">{{card.qq}}</span>
				</div>

				<div class="wechat">
					<span class="prefix">微信： </span>
					<span class="content">{{card.wechat}}</span>
				</div>

				<div class="mail">
					<span class="prefix">邮箱： </span>
					<span class="content">{{card.mail}}</span>
				</div>

				<div class="address">
					<span class="prefix">地址： </span>
					<span class="content">{{card.address}}</span>
				</div>

				<div class="url">
					<span class="prefix">网址： </span>
					<span class="content">{{card.url}}</span>
				</div>

				<div class="company">
					<span class="prefix">公司： </span>
					<span class="content">{{card.company}}</span>
				</div>

				<div class="business_scope">
					<span class="prefix">经营范围： </span>
					<span class="content">{{card.business_scope}}</span>
				</div>

				<div class="control">
					<button @click="close()">
						关闭
					</button>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import mixin from '/src/mixins/page.js';
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				url_submit: "/apis/user/liaison?",
				url_get_obj: "/apis/user/liaison?method=get_obj",
				list: [],
				card: {},
				card_show: false
			}
		},
		methods: {
			get_id() {
				var username = $.db.get('account');
				var id = 0;
				this.$get('~/apis/user/account?size=0', {
					username
				}, function(json) {
					if (json.result) {
						id = json.result.list[0].user_id;
					}
				})
				return id;
			},
			get_liaison(user_id) {
				var _this = this;
				this.$get('~/api/user/liaison?size=0', {
					user_id
				}, function(json) {
					if (json.result) {
						_this.list = json.result.list;
						console.log(JSON.stringify(_this.list));
					}
				})
			},
			get_card(card_id) {
				var _this = this;
				this.card_show = true;
				this.$get('~/apis/user/card?size=0', {
					card_id
				}, function(json) {
					if (json.result) {
						_this.card = json.result.list[0];
						_this.get_style(json.result.list[0].style_id);
					}
				})
			},
			get_style(style_id) {
				var _this = this;
				this.$get('~/apis/user/card_style?size=0', {
					style_id
				}, function(json) {
					if (json.result) {
						var url = "/user/style/" + json.result.list[0].name;
						if (_this.card.color != "") {
							url += "/" + _this.card.color;
						}
						url += "/index.css";
						_this.url = url;
					}
				});
			},
			close() {
				this.card_show = false;
				this.card = {};
			}
		},
		created() {
			var id = this.get_id();
			this.get_liaison(id);
		}
	}
</script>

<style lang="scss">
	.card {
		z-index: 100;
		position: absolute;
		margin: .75rem;
		padding: .25rem;
	}

	.liaison {
		z-index: 1;
		padding: .25rem;
		background: #BBBBBB;
	}

	.liaison .liaison_card {
		margin: .5rem .25rem;
		width: 99%;
		height: 4.75rem;
		background: white;
	}

	.liaison .liaison_card .frame {
		float: left;
		width: 4.5rem;
		height: 4.5rem;
		margin: .25rem;
		background: #00E0E0;
		text-align: center;
		line-height: 4rem;
	}

	.liaison .liaison_card .content {
		float: left;

	}
</style>
