import Vue from 'vue'
import { Button, Tabs, TabPane, Form, FormItem, Input, Row, Col, Checkbox, Message, Container, Header, Aside, Main, Menu, MenuItem, MenuItemGroup, Submenu, Breadcrumb, BreadcrumbItem, Card, Select, Option, Table, TableColumn, Switch, Dialog, Pagination, Upload, Tooltip, Tag, Tree } from "element-ui";

Vue.prototype.$message = Message; // 添加全局ele-ui的message方法
Vue.use(Tree);
Vue.use(Tag);
Vue.use(Tooltip);
Vue.use(Upload);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Switch);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);
Vue.use(Card);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Header);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
