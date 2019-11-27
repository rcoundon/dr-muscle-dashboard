<template>
  <span>
    <b-table :data="tableData" striped hoverable>
      <template slot-scope="props">
        <b-table-column field="date" label="Date">
          {{ props.row.date }}
        </b-table-column>
        <b-table-column field="weight" label="Weight" numeric>
          {{ props.row.weight }}
        </b-table-column>
        <b-table-column field="reps" label="Reps" numeric>
          {{ props.row.reps }}
        </b-table-column>
        <b-table-column field="volume" label="Volume" numeric>
          {{ props.row.volume }}
        </b-table-column>
      </template>
    </b-table>
  </span>
</template>

<script>
export default {
  props: {
    weight: {
      required: true,
      type: Array,
      default: () => []
    },
    reps: {
      required: true,
      type: Array,
      default: () => []
    },
    dates: {
      required: true,
      type: Array,
      default: () => []
    },
    exercise: {
      required: true,
      type: String,
      default: "Unknown"
    }
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          field: "date",
          label: "Date",
          numeric: false
        },
        {
          field: "weight",
          label: "Weight",
          numeric: true
        },
        {
          field: "reps",
          label: "Reps",
          numeric: true
        },
        {
          field: "volume",
          label: "Volume",
          numeric: true
        }
      ]
    };
  },
  watch: {
    weight: {
      handler: function() {
        this.buildTableData();
      }
    }
  },
  created() {
    this.buildTableData();
  },
  methods: {
    buildTableData() {
      const data = [];
      this.reps.forEach((repValue, idx) => {
        const item = {
          reps: repValue,
          weight: this.weight[idx],
          date: this.dates[idx],
          volume: (repValue * this.weight[idx]).toFixed(1)
        };
        data.push(item);
      });
      this.tableData = data;
    }
  }
};
</script>

<style></style>
