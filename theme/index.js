import global from './global.js'
import autocomplete from './autocomplete/index.js'
import cascadeselect from './cascadeselect/index.js'
import checkbox from './checkbox/index.js'
import colorpicker from './colorpicker/index.js'
import datepicker from './datepicker/index.js'
import floatlabel from './floatlabel/index.js'
import iconfield from './iconfield/index.js'
import inputgroup from './inputgroup/index.js'
import inputotp from './inputotp/index.js'
import inputgroupaddon from './inputgroupaddon/index.js'
import inputmask from './inputmask/index.js'
import inputnumber from './inputnumber/index.js'
import inputtext from './inputtext/index.js'
import knob from './knob/index.js'
import listbox from './listbox/index.js'
import multiselect from './multiselect/index.js'
import password from './password/index.js'
import radiobutton from './radiobutton/index.js'
import rating from './rating/index.js'
import select from './select/index.js'
import selectbutton from './selectbutton/index.js'
import slider from './slider/index.js'
import textarea from './textarea/index.js'
import togglebutton from './togglebutton/index.js'
import toggleswitch from './toggleswitch/index.js'
import treeselect from './treeselect/index.js'
import button from './button/index.js'
import speeddial from './speeddial/index.js'
import splitbutton from './splitbutton/index.js'
import datatable from './datatable/index.js'
import dataview from './dataview/index.js'
import orderlist from './orderlist/index.js'
import organizationchart from './organizationchart/index.js'
import paginator from './paginator/index.js'
import picklist from './picklist/index.js'
import tree from './tree/index.js'
import treetable from './treetable/index.js'
import timeline from './timeline/index.js'
import accordion from './accordion/index.js'
import card from './card/index.js'
import deferred from './deferred/index.js'
import divider from './divider/index.js'
import fieldset from './fieldset/index.js'
import panel from './panel/index.js'
import scrollpanel from './scrollpanel/index.js'
import splitter from './splitter/index.js'
import stepper from './stepper/index.js'
import tabs from './tabs/index.js'
import toolbar from './toolbar/index.js'
import confirmpopup from './confirmpopup/index.js'
import confirmdialog from './confirmdialog/index.js'
import dialog from './dialog/index.js'
import drawer from './drawer/index.js'
import popover from './popover/index.js'
import tooltip from './tooltip/index.js'
import fileupload from './fileupload/index.js'
import breadcrumb from './breadcrumb/index.js'
import contextmenu from './contextmenu/index.js'
import dock from './dock/index.js'
import menu from './menu/index.js'
import menubar from './menubar/index.js'
import megamenu from './megamenu/index.js'
import panelmenu from './panelmenu/index.js'
import tieredmenu from './tieredmenu/index.js'
import message from './message/index.js'
import toast from './toast/index.js'
import carousel from './carousel/index.js'
import galleria from './galleria/index.js'
import image from './image/index.js'
import avatar from './avatar/index.js'
import badge from './badge/index.js'
import blockui from './blockui/index.js'
import chip from './chip/index.js'
import inplace from './inplace/index.js'
import metergroup from './metergroup/index.js'
import scrolltop from './scrolltop/index.js'
import skeleton from './skeleton/index.js'
import progressbar from './progressbar/index.js'
import progressspinner from './progressspinner/index.js'
import ripple from './ripple/index.js'
import tag from './tag/index.js'
import terminal from './terminal/index.js'

export default {
  global,
  directives: {
    tooltip,
    ripple,
  },
  autocomplete,
  cascadeselect,
  checkbox,
  colorpicker,
  datepicker,
  floatlabel,
  iconfield,
  inputgroup,
  inputotp,
  inputgroupaddon,
  inputmask,
  inputnumber,
  inputtext,
  knob,
  listbox,
  multiselect,
  password,
  radiobutton,
  rating,
  select,
  selectbutton,
  slider,
  textarea,
  togglebutton,
  toggleswitch,
  treeselect,
  button,
  speeddial,
  splitbutton,
  datatable,
  dataview,
  orderlist,
  organizationchart,
  paginator,
  picklist,
  tree,
  treetable,
  timeline,
  accordion,
  card,
  deferred,
  divider,
  fieldset,
  panel,
  scrollpanel,
  splitter,
  stepper,
  tabs,
  toolbar,
  confirmpopup,
  confirmdialog,
  dialog,
  drawer,
  popover,
  fileupload,
  breadcrumb,
  contextmenu,
  dock,
  menu,
  menubar,
  megamenu,
  panelmenu,
  tieredmenu,
  message,
  toast,
  carousel,
  galleria,
  image,
  avatar,
  badge,
  blockui,
  chip,
  inplace,
  metergroup,
  scrolltop,
  skeleton,
  progressbar,
  progressspinner,
  tag,
  terminal,
  tooltip: {
    root: {
      background: '#1F2A44', // Dark background to match your theme
      color: '#FFFFFF', // White text for readability
      borderRadius: '4px',
      padding: '0.5rem 1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      fontSize: '0.875rem',
      zIndex: 1000,
    },
    arrow: {
      background: '#1F2A44',
    },
  },
}
