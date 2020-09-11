<template>
	<main id="user_liaison_form">
		<mm_grid>
			<mm_col width="33">
				<mm_form class="card">
					<div class="head arrow">
						<h5>{{ form[field] ? '修改' : '创建' }}联系人列表</h5>
					</div>
					<div class="body">
						<dl>
							<dt>用户编号</dt>
							<dd>
								<mm_select v-model="form.user_id" :options="$to_kv(list_account, 'user_id', 'nickname')" />
							</dd>
							<dt>名片用户</dt>
							<dd>
								<mm_select v-model="form.owner_id" :options="$to_kv(list_account, 'user_id', 'nickname')" />
							</dd>
							<dt>名片编号</dt>
							<dd>
								<mm_select v-model="form.card_id" :options="$to_kv(list_card, 'card_id', 'name')" />
							</dd>
							<dt class="required">姓名</dt>
							<dd>
								<mm_input v-model="form.name" :minlength="0" :maxlength="0" placeholder=""
								 :required="true" />
							</dd>
							<dt class="required">职位</dt>
							<dd>
								<mm_input v-model="form.job" :minlength="0" :maxlength="0" placeholder=""
								 :required="true" />
							</dd>
							<dt>头像</dt>
							<dd>
								<mm_upload_img width="10rem" height="10rem" name="portrait" type="text" v-model="form.portrait" />
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
				url_submit: "/apis/user/liaison?",
				url_get_obj: "/apis/user/liaison?method=get_obj",
				field: "liaison_id",
				query: {
					"liaison_id": 0
				},
				form: {
					"liaison_id": 0,
					"user_id": 0,
					"owner_id": 0,
					"card_id": 0,
					"name": '',
					"job": '',
					"icon": '',
				},
				// 用户编号
				'list_account': [ ],
				// 名片用户
				'list_account': [ ],
				// 名片编号
				'list_card': [ ],
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
			 * 获取名片编号
			 * @param {query} 查询条件
			 */
			get_card(query) {
				var _this = this;
				if (!query) {
					query = {
						field: "card_id,name"
					};
				}
				this.$get('~/apis/user/card?size=0', query, function(json) {
					if (json.result) {
						_this.list_card .clear();
						_this.list_card .addList(json.result.list)
					}
				});
			},
			get_card_info(type){
				var f = this.form;
				var list = this.list_card;
				if(type == "card"){
					for(var i=0;i<list.length;i++){
						if(f.card_id == list[i].card_id){
							f.name = list[i].name;
							f.job = list[i].job;
							f.icon = list[i].icon;
							f.owner_id = list[i].user_id;
							break;
						}
					}
				}
				else{
					for(var i=0;i<list.length;i++){
						if(f.owner_id == list[i].user_id){
							f.name = list[i].name;
							f.job = list[i].job;
							f.icon = list[i].icon;
							f.card_id = list[i].card_id;
							break;
						}
					}
				}
			}
		},
		created() {
			// 获取用户编号
			this.get_account();
			// 获取名片编号
			this.get_card();
		}
	}
</script>

<style>
</style>
