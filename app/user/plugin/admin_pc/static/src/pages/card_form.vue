<template>
	<main id="user_card_form">
		<mm_grid>
			<mm_col width="33">
				<mm_form class="card">
					<div class="head arrow">
						<h5>{{ form[field] ? '修改' : '创建' }}用户名片</h5>
					</div>
					<div class="body">
						<dl>
							<dt>头像</dt>
							<dd>
								<mm_upload_img v-model="form.portrait" width="10rem" height="10rem" name="portrait" type="text" />
							</dd>
							<dt class="required">姓名</dt>
							<dd>
								<mm_input v-model="form.name" :minlength="0" :maxlength="0" placeholder="这里填写姓名"
								 :required="true" />
							</dd>
							<dt class="required">职位</dt>
							<dd>
								<mm_input v-model="form.job" :minlength="0" :maxlength="0" placeholder="担任什么职位"
								 :required="true" />
							</dd>
							<dt>公司</dt>
							<dd>
								<mm_input v-model="form.company" :minlength="0" :maxlength="0" placeholder="公司的名称或主要工作名" />
							</dd>
							<dt>LOGO</dt>
							<dd>
								<mm_upload_img v-model="form.logo" width="10rem" height="10rem" name="logo" type="text" />
							</dd>
							<dt>地址</dt>
							<dd>
								<mm_input v-model="form.address" :minlength="0" :maxlength="0" placeholder="本人的所在地址或公司所在地址" />
							</dd>
							<dt>网址</dt>
							<dd>
								<mm_input v-model="form.url" :minlength="0" :maxlength="0" placeholder="用于个人网站或公司网站的链接地址" />
							</dd>
							<dt>职务</dt>
							<dd>
								<mm_textarea v-model="form.work_extent" type="text" placeholder="做什么事情或工作的范围" />
							</dd>
							<dt>经营范围</dt>
							<dd>
								<mm_textarea v-model="form.business_scope" type="text" placeholder="" />
							</dd>
							<dt class="required">电话</dt>
							<dd>
								<mm_input v-model="form.phone" :minlength="0" :maxlength="0" placeholder=""
								 :required="true" />
							</dd>
							<dt>邮箱</dt>
							<dd>
								<mm_input v-model="form.mail" :minlength="0" :maxlength="0" placeholder="" />
							</dd>
							<dt>QQ</dt>
							<dd>
								<mm_input v-model="form.qq" :minlength="0" :maxlength="0" placeholder="" />
							</dd>
							<dt>微信</dt>
							<dd>
								<mm_input v-model="form.wechat" :minlength="0" :maxlength="0" placeholder="" />
							</dd>
							<dt>用户编号</dt>
							<dd>
								<mm_select v-model="form.user_id" :options="$to_kv(list_account, 'user_id', 'nickname')" />
							</dd>
							<dt>名片风格</dt>
							<dd>
								<mm_select v-model="form.style_id" :options="$to_kv(list_card_style, 'style_id', 'name')" />
							</dd>
							<dt v-show="form.style_id > 0">风格颜色</dt>
							<dd v-show="form.style_id > 0">
								<mm_select v-model="form.color" :options="$to_kv(list_card_color, 'value', 'name')" />
							</dd>
							<dt>邀请码</dt>
							<dd>
								<mm_input v-model="form.invite_code" :minlength="0" :maxlength="0" placeholder="用于邀请他人的邀请码" />
							</dd>
							<dt>推荐人编号</dt>
							<dd>
								<mm_select v-model="form.referrer_id" :options="$to_kv(list_account, 'user_id', 'nickname')" />
							</dd>
							<dt>显示状态</dt>
							<dd>
								<mm_switch v-model="form.show_innfo" />
							</dd>
							<dt>显示排名</dt>
							<dd>
								<mm_switch v-model="form.show_ranking" />
							</dd>
						</dl>
					</div>
					<div class="foot">
						<div class="mm_group">
							<button class="btn_default" type="button" @click="cancel">取消</button>
							<button class="btn_primary" type="button" @click="submit()">提交</button>
						</div>
					</div>
				</mm_form>
			</mm_col>
		</mm_grid>
	</main>
</template>


<script>
	import mixin from '/src/mixins/page.js';

	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				url_submit: "/apis/user/card?",
				url_get_obj: "/apis/user/card?method=get_obj",
				field: "card_id",
				query: {
					"card_id": 0
				},
				form: {
					"card_id": 0,
					"portrait": "",
					"name": '',
					"job": '',
					"company": '',
					"logo": '',
					"address": '',
					"url": '',
					"work_extent": '',
					"business_scope": '',
					"phone": '',
					"mail": '',
					"qq": '',
					"wechat": '',
					"user_id": 0,
					"style_id": 0,
					"color": '',
					"invite_code": '',
					"referrer_id": 0,
					"show_innfo": 0,
					"show_ranking": 0,
				},
				// 用户编号
				'list_account': [ ],
				// 名片风格
				'list_card_style': [ ]
			}
		},
		methods: {
			/**
			 * 获取用户编号
			 * @param {query} 查询条件
			 */
			get_account(query) {
				var _this = this;
				if (!query) {
					query = {
						field: "user_id,nickname"
					};
				}
				this.$get('~/apis/user/account?size=0', query, function(json) {
					if (json.result) {
						_this.list_account .clear();
						_this.list_account .addList(json.result.list)
					}
				});
			},
			/**
			 * 获取名片风格
			 * @param {query} 查询条件
			 */
			get_card_style(query) {
				var _this = this;
				if (!query) {
					query = {
						field: "style_id,name"
					};
				}
				this.$get('~/apis/user/card_style?size=0', query, function(json) {
					if (json.result) {
						_this.list_card_style .clear();
						_this.list_card_style .addList(json.result.list);
					}
				});
			},
		},
		computed:{
			// 名片颜色
			list_card_color(){
				var style_id = this.form.style_id;
				var ret = [];
				
				if(style_id){
					var list_style = this.list_card_style;
					for(var i = list_style.length-1;i >= 0;i--){
						if(style_id == list_style[i].style_id){
							ret = list_style[i].color.split("，").map(o =>{
								return {name:o,value:o};
							});
							break;
						}
					}
				}
				
				return ret;
			}
		},
		created() {
			// 获取用户编号
			this.get_account();
			// 获取名片风格
			this.get_card_style({});
		}
	}
</script>

<style>
</style>
