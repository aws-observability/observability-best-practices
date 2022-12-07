package main

import (
	"testing"
)

type sanitizeTest struct {
	inputString, outputString string
}

var sanitizeTests = []sanitizeTest{
	sanitizeTest{"foo", "foo"},
	sanitizeTest{"  ", "__"},
	sanitizeTest{" ,=", "___"},
	sanitizeTest{"count%", "count_percent"},
	sanitizeTest{"foo\tbar", "foo_bar"},
	sanitizeTest{"foo,bar%", "foo_bar_percent"},
	sanitizeTest{"/\\/:@<>“", "________"},
	sanitizeTest{"“", "_"},
	sanitizeTest{"prometheus metric count % is: 200", "prometheus_metric_count__percent_is__200"},
}

func TestSanitize(t *testing.T) {
	for _, test := range sanitizeTests {
		if output := sanitize(test.inputString); output != test.outputString {
			t.Errorf("Output %s not as expected %s", output, test.outputString)
		}
	}
}

type MetricNameLabelTest struct {
	metricName string
	value      Values
	expected   string
}

var metricNameLabelTests = []MetricNameLabelTest{
	MetricNameLabelTest{"name", Count, "name_count"},
	MetricNameLabelTest{"a bc d%", Count, "a_bc_d_percent_count"},
	MetricNameLabelTest{"foo", Max, "foo_max"},
	MetricNameLabelTest{"bar_baz", Min, "bar_baz_min"},
	MetricNameLabelTest{"prometheus_sum_count", Sum, "prometheus_sum_count_sum"},
}

func TestCreateMetricNameLabel(t *testing.T) {
	for _, test := range metricNameLabelTests {
		output := createMetricNameLabel(test.metricName, test.value)
		if output.Name != "__name__" || output.Value != test.expected {
			t.Errorf("Output is not as expected")
		}
	}
}

type NamespaceLabelTest struct {
	namespace string
	expected  string
}

var namespaceLabelTest = []NamespaceLabelTest{
	NamespaceLabelTest{"name", "name"},
	NamespaceLabelTest{"a bc d%", "a_bc_d_percent"},
	NamespaceLabelTest{"foo/", "foo_"},
}

func TestCreateNamespaceLabel(t *testing.T) {
	for _, test := range namespaceLabelTest {
		output := createNamespaceLabel(test.namespace)
		if output.Name != "namespace" || output.Value != test.expected {
			t.Error(output.Name, output.Value)
			t.Errorf("Output is not as expected")
		}
	}
}

type SampleTest struct {
	value             Value
	timestamp         int64
	expectedValue     Value
	expectedTimestamp int64
}

var values = &Value{Count: 1, Sum: 2, Max: 3, Min: 4}

var sampleTest = []SampleTest{
	SampleTest{*values, 123, *values, 123},
}

func TestCreateSamples(t *testing.T) {
	for _, test := range sampleTest {
		countOutput := createCountSample(test.value, test.timestamp)
		if countOutput.Value != test.expectedValue.Count && countOutput.Timestamp != test.expectedTimestamp {
			t.Errorf("Output is not as expected")
		}

		maxOutput := createMaxSample(test.value, test.timestamp)
		if maxOutput.Value != test.expectedValue.Max && maxOutput.Timestamp != test.expectedTimestamp {
			t.Errorf("Output is not as expected")
		}

		minOutput := createMinSample(test.value, test.timestamp)
		if minOutput.Value != test.expectedValue.Min && minOutput.Timestamp != test.expectedTimestamp {
			t.Errorf("Output is not as expected")
		}

		sumOutput := createSumSample(test.value, test.timestamp)
		if sumOutput.Value != test.expectedValue.Sum && sumOutput.Timestamp != test.expectedTimestamp {
			t.Errorf("Output is not as expected")
		}
	}
}

var noDimensions = &Dimensions{}
var someDimensions = &Dimensions{Class: "Amazon", Resource: "Kinesis"}
var allDimensions = &Dimensions{Class: "AWS", Resource: "Lambda", Service: "Data Firehose Transformation", Type: "Type 2"}

type DimensionLabelTest struct {
	dimensions           Dimensions
	expectedOutputLength int
}

var dimensionLabelsTest = []DimensionLabelTest{
	DimensionLabelTest{*noDimensions, 0},
	DimensionLabelTest{*someDimensions, 2},
	DimensionLabelTest{*allDimensions, 4},
}

func TestCreateDimensionsLabel(t *testing.T) {
	for _, test := range dimensionLabelsTest {
		output := createDimensionLabels(test.dimensions)
		if len(output) != test.expectedOutputLength {
			t.Errorf("Incorrect length for the dimensions")
		}
	}
}
