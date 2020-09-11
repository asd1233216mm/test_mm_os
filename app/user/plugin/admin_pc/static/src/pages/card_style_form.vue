<template>
	<main id="user_card_style_form">
		<mm_grid>
			<mm_col width="33">
				<mm_form class="card">
					<div class="head arrow">
						<h5>{{ form[field] ? '修改' : '创建' }}名片风格</h5>
					</div>
					<div class="body">
						<dl>
							<dt class="required">风格名称</dt>
							<dd>
								<mm_input v-model="form.name" :minlength="0" :maxlength="0" placeholder=""
								 :required="true" />
							</dd>
							<dt class="required">风格颜色</dt>
							<dd>
								<mm_input v-model="form.color" :minlength="0" :maxlength="0" placeholder="用，号分隔"
								 :required="true" />
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
				url_submit: "/apis/user/card_style?",
				url_get_obj: "/apis/user/card_style?method=get_obj",
				field: "style_id",
				query: {
					"style_id": 0
				},
				form: {
					"style_id": 0,
					"name": '',
					"color": '',
				},
			}
		},
		methods: {
		},
		created() {
		}
	}
</script>

<style>
</style>
