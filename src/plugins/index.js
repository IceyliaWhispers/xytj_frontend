import Vue from "vue";
import {Timeline,TimelineItem, Empty, Divider, Popover, Steps, Step, Upload, Tabs,TabPane, Drawer, Radio, Option, Select, Tree, Tag, MessageBox, Dialog, Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination} from "element-ui";

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Radio);
Vue.use(Drawer);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Upload);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Popover);
Vue.use(Divider);
Vue.use(Empty);
Vue.use(Timeline);
Vue.use(TimelineItem);




Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;