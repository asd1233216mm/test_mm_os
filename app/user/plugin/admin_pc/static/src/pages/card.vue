<template>
	<main id="user_card">
		<mm_grid>
			<mm_col>
				<mm_view>
					<header class="arrow">
						<h5>用户名片</h5>
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
									<mm_select v-model="query.style" title="名片风格" :options="$to_kv(list_card_style, 'style_id', 'name')"
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
								<mm_btn class="btn_primary-x" url="./card_form">添加</mm_btn>
								<mm_btn @click.native="show = true" class="btn_primary-x" v-bind:class="{ 'disabled': !selects }">批量修改</mm_btn>
							</div>
						</div>
						<mm_table type="2">
							<thead>
								<tr>
									<th scope="col" class="th_selected"><input type="checkbox" :checked="select_state" @click="select_all()" /></th>
									<th scope="col" class="th_id"><span>#</span></th>
									<th scope="col" class="th_portrait">
										<mm_reverse title="头像" v-model="query.orderby" field="portrait" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="姓名" v-model="query.orderby" field="name" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="职位" v-model="query.orderby" field="job" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="公司" v-model="query.orderby" field="company" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="地址" v-model="query.orderby" field="address" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="网址" v-model="query.orderby" field="url" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="电话" v-model="query.orderby" field="phone" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="邮箱" v-model="query.orderby" field="mail" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="QQ" v-model="query.orderby" field="qq" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="微信" v-model="query.orderby" field="wechat" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="用户" v-model="query.orderby" field="user_id" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="名片风格" v-model="query.orderby" field="style_id" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="风格颜色" v-model="query.orderby" field="color" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="邀请码" v-model="query.orderby" field="invite_code" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="推荐人编号" v-model="query.orderby" field="referrer_id" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="显示状态" v-model="query.orderby" field="show_innfo" :func="search"></mm_reverse>
									</th>
									<th scope="col">
										<mm_reverse title="显示排名" v-model="query.orderby" field="show_ranking" :func="search"></mm_reverse>
									</th>
									<th scope="col" class="th_handle"><span>操作</span></th>
								</tr>
							</thead>
							<draggable v-model="list" tag="tbody" @change="sort_change">
								<tr v-for="(o, idx) in list" :key="idx" :class="{'active': select == idx}" @click="selected(idx)">
									<th scope="row"><input type="checkbox" :checked="select_has(o[field])" @click="select_change(o[field])" /></th>
									<td>
										<span>{{ o.card_id }}</span>
									</td>
									<td>
										<span>
											<img class="avatar" :src="o.portrait" alt="" />
										</span>
									</td>
									<td>
										<span>{{ o.name }}</span>
									</td>
									<td>
										<span>{{ o.job }}</span>
									</td>
									<td>
										<span>{{ o.company }}</span>
									</td>
									<td>
										<span>{{ o.address }}</span>
									</td>
									<td>
										<span>{{ o.url }}</span>
									</td>
									<td>
										<span>{{ o.phone }}</span>
									</td>
									<td>
										<span>{{ o.mail }}</span>
									</td>
									<td>
										<span>{{ o.qq }}</span>
									</td>
									<td>
										<span>{{ o.wechat }}</span>
									</td>
									<td>
										<span>{{ get_name(list_account, o.user_id, 'user_id', 'nickname') }}</span>
									</td>
									<td>
										<span>{{ get_name(list_card_style, o.style_id, 'style_id', 'name') }}</span>
									</td>
									<td>
										<span>{{ o.color }}</span>
									</td>
									<td>
										<span>{{ o.invite_code }}</span>
									</td>
									<td>
										<span>{{ get_name(list_account, o.referrer_id, 'user_id', 'nickname') }}</span>
									</td>
									<td>
										<mm_switch v-model="o.show_innfo" @click.native="set(o)" />
									</td>
									<td>
										<mm_switch v-model="o.show_ranking" @click.native="set(o)" />
									</td>
									<td>
										<mm_btn class="btn_primary" :url="'./card_form?card_id=' + o[field]">修改</mm_btn>
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
						<dt>名片风格</dt>
						<dd>
							<mm_select v-model="form.style_id" :options="$to_kv(list_card_style, 'style_id', 'name')" />
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
				url_get_list: "/apis/user/card?",
				url_del: "/apis/user/card?method=del&",
				url_set: "/apis/user/card?method=set&",
				field: "card_id",
				query_set: {
					"card_id": ""
				},
				// 查询条件
				query: {
					//页码
					page: 1,
					//页面大小
					size: 10,
					// 名片编号
					'card_id': 0,
					// 姓名
					'name': '',
					// 显示状态
					'show_innfo': 0,
					// 显示排名
					'show_ranking': 0,
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
				// 名片风格
				'list_card_style': [ ],
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
