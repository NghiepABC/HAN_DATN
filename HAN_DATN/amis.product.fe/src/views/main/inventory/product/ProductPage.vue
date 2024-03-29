<template>
  <div class="container-table">
    <div class="container-table_header">
      <div class="name-table">
        <h1>{{ $t("page.product") }}</h1>
        <router-link to="/inventory" class="prev_page">
          <div class="prev_page-icon"></div>
          <div class="prev_page-text">{{ $t("common.back") }}</div>
        </router-link>
      </div>
      <div class="action-table">
        <div class="btn-add">
          <button
            @click="customHandleOpenModal(ActionTable.Add)"
            title="Ctrl + 1"
            class="add"
          >
            {{ $t("common.add") }}
          </button>
          <button class="import toggle-list">
            <i class="icon"></i>
            <div class="table-list_action">
              <div
                @click="
                  Base.downloadFromUrl(
                    `${environment.IMAGE_API}/Excel/Template/product.xlsx`
                  )
                "
                class="list_action-item"
              >
                <i class="i excel"></i> {{ $t("common.export_sample") }}
              </div>
              <div
                @click="Base.showDialog()"
                :title="$t('common.import')"
                class="list_action-item"
              >
                <i class="i excel"></i> {{ $t("common.import") }}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="table-function sticky">
      <div class="form-fix">
        <div class="mi-arrow-check-all"></div>
        <button class="table-function_series toggle-list">
          <span>{{ $t("common.batch_execution") }}</span>
          <div class="table-function_series-icon"></div>
          <div
            v-show="Base.checkShowActionSeries.length > 0"
            class="table-list_action"
          >
            <div class="list_action-item" @click="handleQuestionDeleteAll()">
              {{ $t("common.delete") }}
            </div>
          </div>
        </button>
        <base-form-key-search
          :loadData="Base.loadData"
          :moduleFilter="ModuleName.Product"
        ></base-form-key-search>
      </div>
      <div style="min-width: 350px" class="table-function_search">
        <div class="search-table">
          <input
            @input="Base.handleSearchData"
            class="input input-table_search"
            type="text"
            :placeholder="$t('module.inventory.search_inventory_code_name')"
          />
          <div class="icon-search"></div>
        </div>
        <div
          @click="Base.loadData()"
          class="action-render_table reload-table"
          :content="$t('common.load_data')"
        ></div>
        <div
          @click="Base.exportToExcel()"
          class="action-render_table export-data"
          :content="$t('common.export_excel')"
        ></div>
        <div
          @click="Base.handleShowSettingTable()"
          class="action-render_table setting-table"
          :content="$t('common.customize_interface')"
        ></div>
      </div>
    </div>
    <base-table
      :BaseComponent="Base"
      :handleClickActionColumTable="handleClickActionColumTable"
    >
    </base-table>
    <teleport to="#app">
      <base-modal-form v-if="Base.isShowModal">
        <form-product
          :Base="Base"
          :optionDepotIn="{
            optionDepot,
            addItem: (item: any)=> {
                optionDepot = [item, ...optionDepot]
              }
            }"
          :optionOriginIn="{
            optionOrigin,
            addItem: (item: any)=> {
                optionOrigin = [item, ...optionOrigin]
              }
            }"
          :optionTrademarkIn="{
            optionTrademark,
            addItem: (item: any)=> {
              optionTrademark = [item, ...optionTrademark]
              }
            }"
          :optionCategoryIn="{
            optionCategory,
            addItem: (item: any)=> {
              optionCategory = [item, ...optionCategory]
              }
            }"
        >
        </form-product>
      </base-modal-form>
      <base-modal-form v-if="Base.isShowDialog">
        <base-import-excel :Base="Base"> </base-import-excel>
      </base-modal-form>
      <base-modal-form v-if="Base.isShowResultExcel">
        <base-form-excel-result
          :ModuleI18n="'module.inventory'"
          :Base="Base"
        ></base-form-excel-result>
      </base-modal-form>
      <base-setting
        v-if="Base.isShowSettingTable"
        :columns="Base.columnSetting"
        :handleShowSettingTable="Base.handleShowSettingTable"
      ></base-setting>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Grid, ModuleName, ActionTable } from "@/core/public_api";
import {
  reactive,
  onBeforeMount,
  onUnmounted,
  onMounted,
  defineAsyncComponent,
  ref,
} from "vue";
import { useI18n } from "vue-i18n";
import { environment } from "@/environments/environment.prod";
import ProductApi from "@/api/module/product";
import DepotApi from "@/api/module/depot";
import CategoryApi from "@/api/module/category";
import TrademarkApi from "@/api/module/trademark";
import OriginApi from "@/api/module/origin";
const FormProduct = defineAsyncComponent(() => import("./FormProduct.vue"));

const { t } = useI18n();
/**
 * Khai báo các api của module
 * HAN 13-03-2023
 */
const api: ProductApi = new ProductApi();

/** Sử dụng base thư viện Grid đã viết */
const Base: Grid = reactive(new Grid(ModuleName.Product, api));

/** Dữ liệu dropdown*/
const optionOrigin: any = ref([]);
const optionTrademark: any = ref([]);
const optionCategory: any = ref([]);
const optionDepot: any = ref([]);

/**
 * Trước khi mounted sẽ load dữ liệu 1 lần
 * HAN - 08.03.2023
 */
onBeforeMount(() => {
  Base.loadData({
    v_Offset: Base.recordSelectPaging,
    v_Limit: Base.PageSize,
    v_Where: Base.keyword,
  });
  loadDropDown();
});

/**
 * Hàm load dữ liệu đổ vào dropdowns combobox
 * HAN 08.03.2023
 */
function loadDropDown() {
  Base.apiService.callApi(
    new OriginApi().getDropdown,
    null,
    async (response: any) => {
      optionOrigin.value = response;
    }
  );
  Base.apiService.callApi(
    new TrademarkApi().getDropdown,
    null,
    async (response: any) => {
      optionTrademark.value = response;
    }
  );
  Base.apiService.callApi(
    new CategoryApi().getDropdown,
    null,
    async (response: any) => {
      optionCategory.value = response;
    }
  );
  Base.apiService.callApi(
    new DepotApi().getDropdown,
    null,
    async (response: any) => {
      optionDepot.value = response;
    }
  );
}

/**
 * Hàm mở modal và lấy mã tự sinh
 * HAN - 08.03.2023
 */
async function customHandleOpenModal(action: any, recordId: any = undefined) {
  try {
    await Base.apiService.callApi(
      api.nextValue,
      null,
      (response: any) => {
        Base.RecordCode = response;
      },
      false
    );
    Base.openModal(action, recordId);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Hàm xử lý khi click vào các hành động của từng cột dữ liệu table
 * HAN - 08.03.2023
 */
function handleClickActionColumTable(
  action: any,
  recordId: any,
  recordCode: any
) {
  try {
    if (action == ActionTable.Edit || action == ActionTable.Replication) {
      Base.openModal(action, recordId);
    } else if (action == ActionTable.Delete) {
      questionDeleteRecordApi(recordId, recordCode);
    } else if (action === ActionTable.StopUsing) {
      Base.toggleRecordActiveApi(recordId);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 *  Hàm thực hiện hỏi xoá một bản ghi
 * HAN - 08.03.2023
 */
function questionDeleteRecordApi(recordId: any, recordCode: any) {
  Base.showNotificationWanning(
    Base.deleteRecord,
    t("message.crud.question_wanning_delete", {
      module: t(`module.inventory.${Base.Module}`),
      code: recordCode ? recordCode : t("message.crud.statue_of_liberty"),
    }),
    recordId
  );
}

/**
 * Hàm hỏi xác nhận xoá nhiều
 * HAN - 08.03.2023
 */
function handleQuestionDeleteAll() {
  try {
    if (Base.checkShowActionSeries.length > 0) {
      Base.showNotificationWanning(
        Base.deleteAll,
        t("message.crud.wanning_delete_all")
      );
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Hàm xử lý các event nút bấm tắt
 * HAN 08.03.2023
 */
function handleKey(event: any) {
  Base.handleEventCtrlNum1(event, customHandleOpenModal, ActionTable.Add);
  Base.handleEventShiftDelete(event, handleQuestionDeleteAll);
}

/**
 * Khi Mounted thì bắt đầu lắng nghe các sự kiện
 * HAN - 08.03.2023
 */
onMounted(() => {
  window.addEventListener("keydown", handleKey);
  window.addEventListener("keyup", Base.handleEventInterruptCtrlNum1);
});

/**
 * Khi UnMounted thì bắt đầu huỷ lắng nghe các sự kiện
 * HAN - 08.03.2023
 */
onUnmounted(() => {
  window.removeEventListener("keyup", Base.handleEventInterruptCtrlNum1);
  window.removeEventListener("keydown", handleKey);
  Base.setEmptyData();
});
</script>

<style scoped>
@import "../../../../assets/css/crud.css";
</style>
