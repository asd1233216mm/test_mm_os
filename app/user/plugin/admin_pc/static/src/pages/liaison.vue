<template>
	<main id="user_liaison">
		<mm_grid>
			<mm_col>
				<mm_view>
					<header class="arrow">
						<h5>联系人列表</h5>
					</header>
					<mm_body>
						<mm_form class="mm_filter">
							<h5><span>筛选条件</span></h5>
							<mm_list col="3">
								<mm_col>
									<mm_input v-model="query.keyword" title="关键词" desc="姓名"
									 @blur="search()" />
								</mm_col>
								<mm_col>
									<mm_select v-model="query.user_id" title="用户编号" :options="$to_kv(list_account, 'user_id', 'nickname')"
									 @change="search()" />
								</mm_col>
								<mm_col>
									<mm_select v-model="query.owner_id" title="名片用户" :options="$to_kv(list_account, 'user_id', 'nickname')"
									 @change="search()" />
								</mm_col>
								<mm_col>
									<mm_select v-model="query.card_id" title="名片编号" :options="$to_kv(list_card, 'card_id', 'name')"
									 @change="search()" />
								</mm_col>
								<mm_col>
									<mm_btn class="btn_primary-x" type="reset" @click.native="reset();search()">重置</mm_btn>
								</mm_col>
							</mm_list>
						</mm_form>
						<div class="mm_action">
							<h5><span>操作</span></h5>
							<div class="">
								<mm_btn class="btn_primary-x" url="./liaison_form">添加</mm_btn>
								<mm_btn @click.native="show = true" class="btn_primary-x" v-bind:class="{ 'disabled': !selects }">批量修改</mm_btn>
							</div>
						</div>
						<mm_table type="2">
							<thead>
								<tr>
									<th scope="col" class="th_selected"><input type="checkbox" :checked="select_state" @click="select_all()" /></th>
									<th scope="col" class="th_id"><span>#</span></th>
									<th scope="col">
										<mm_reverse title="用户编号" v-model="query.orderby" field="user_id" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="名片用户" v-model="query.orderby" field="owner_id" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="名片编号" v-model="query.orderby" field="card_id" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="姓名" v-model="query.orderby" field="name" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="职位" v-model="query.orderby" field="job" :func="search"></mm_reverse>
									</th>
									<th scope="col" class="th_handle"><span>操作</span></th>
								</tr>
							</thead>
							<draggable v-model="list" tag="tbody" @change="sort_change">
								<tr v-for="(o, idx) in list" :key="idx" :class="{'active': select == idx}" @click="selected(idx)">
									<th scope="row"><input type="checkbox" :checked="select_has(o[field])" @click="select_change(o[field])" /></th>
									<td>
										<span>{{ o.liaison_id }}</span>
									</td>
									<td>
										<span>{{ get_name(list_account, o.user_id, 'user_id', 'nickname') }}</span>
									</td>
									<td>
										<span>{{ get_name(list_account, o.owner_id, 'user_id', 'nickname') }}</span>
									</td>
									<td>
										<span>{{ get_name(list_card, o.card_id, 'card_id', 'name') }}</span>
									</td>
									<td>
										<span>{{ o.name }}</span>
									</td>
									<td>
										<span>{{ o.job }}</span>
									</td>
									<td>
										<mm_btn class="btn_primary" :url="'./liaison_form?liaison_id=' + o[field]">修改</mm_btn>
										<mm_btn class="btn_warning" @click.native="del_show(o, field)">删除</mm_btn>
									</td>
								</tr>
							</draggable>
						</mm_table>
					</mm_body>
					<footer>
						<mm_grid class="mm_data_count">
							<mm_col>
								<mm_select v-model="query.size" :options="$to_size()" @change="search()" />
							</mm_col>
							<mm_col width="50" style="min-width: 22.5rem;">
								<mm_pager display="2" v-model="query.page" :count="count / query.size" :func="goTo" :icons="['首页', '上一页', '下一页', '尾页']"></mm_pager>
							</mm_col>
							<mm_col>
								<div class="right plr">
									<span class="mr">共 {{ count }} 条</span>
									<span>当前</span>
									<input class="pager_now" v-model.number="page_now" @blur="goTo(page_now)" @change="page_change" />
									<span>/{{ page_count }}页</span>
								</div>
							</mm_col>
						</mm_grid>
					</footer>
				</mm_view>
			</mm_col>
		</mm_grid>
		<mm_modal v-model="show" mask="true">
			<mm_view class="card bg_no">
				<header class="bg_white">
					<h5>批量修改</h5>
				</header>
				<mm_body>
					<dl>
						<dt>用户编号</dt>
						<dd>
							<mm_select v-model="form.user_id" :options="$to_kv(list_account, 'user_id', 'nickname')" />
						</dd>
						<dt>名片用户</dt>
						<dd>
							<mm_select v-model="form.owner_id" :options="$to_kv(list_account, 'owner_id', 'nickname')" />
						</dd>
						<dt>名片编号</dt>
						<dd>
							<mm_select v-model="form.card_id" :options="$to_kv(list_card, 'card_id', 'name')" />
						</dd>
					</dl>
				</mm_body>
				<footer>
					<div class="mm_group">
						<button class="btn_default" type="reset" @click="show = false">取消</button>
						<button class="btn_primary" type="button" @click="batchSet()">提交</button>
					</div>
				</footer>
			</mm_view>
		</mm_modal>
	</main>
</template>

<script>
	import mixin from '/src/mixins/page.js';

	export default {
		mixins: [mixin],
		data() {
			return {
				// 列表请求地址
				url_get_list: "/apis/user/liaison",
				url_del: "/apis/user/liaison?method=del&",
				url_set: "/apis/user/liaison?method=set&",
				field: "liaison_id",
				query_set: {
					"liaison_id": ""
				},
				// 查询条件
				query: {
					//页码
					page: 1,
					//页面大小
					size: 10,
					// 联系人编号
					'liaison_id': 0,
					// 姓名
					'name': '',
					// 关键词
					'keyword': '',
					//排序
					orderby: ""
				},
				form: {},
				//颜色
				arr_color: ['', '', 'font_yellow', 'font_success', 'font_warning', 'font_primary', 'font_info', 'font_default'],
				// 用户编号
				'list_account': [ ],
				// 名片用户
				'list_account': [ ],
				// 名片编号
				'list_card': [ ],
				// 视图模型
				vm: {}
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
		},
		created() {
			// 获取用户编号 // 获取名片用户
			this.get_account();
			
			// 获取名片编号
			this.get_card();
		}
	}
</script>

<style>
</style>
