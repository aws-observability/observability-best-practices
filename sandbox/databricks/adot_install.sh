#!/bin/bash
set -e

function configure_spark {
cat << EOF > /databricks/spark/conf/metrics.properties
*.sink.prometheusServlet.class=org.apache.spark.metrics.sink.PrometheusServlet
*.sink.prometheusServlet.path=/metrics/prometheus
master.sink.prometheusServlet.path=/metrics/master/prometheus
applications.sink.prometheusServlet.path=/metrics/applications/prometheus
EOF

cat << EOF > /databricks/spark/dbconf/log4j/master-worker/metrics.properties
*.sink.prometheusServlet.class=org.apache.spark.metrics.sink.PrometheusServlet
*.sink.prometheusServlet.path=/metrics/prometheus
master.sink.prometheusServlet.path=/metrics/master/prometheus
applications.sink.prometheusServlet.path=/metrics/applications/prometheus
EOF
}

function generate_adot_config_template {
  sudo pip3 install awscli

  # ADOT_INIT_SCRIPT_BUCKET, ADOT_DRIVER_CONFIG and ADOT_EXECUTOR_CONFIG must be set as environment variables
  # in Databricks' cluster "Advanced options"
  # See: https://docs.databricks.com/clusters/configure.html#environment-variables
  if [ ! -z $DB_IS_DRIVER ] && [ $DB_IS_DRIVER = TRUE ] ; then
  aws s3 cp s3://$ADOT_INIT_SCRIPT_BUCKET/$ADOT_DRIVER_CONFIG .tmp_adot_config.yaml
  else
  aws s3 cp s3://$ADOT_INIT_SCRIPT_BUCKET/$ADOT_EXECUTOR_CONFIG .tmp_adot_config.yaml
  fi
  
}

function configure_adot {
  sudo apt-get -y install gettext
  
  export SPARK_LOCAL_IP=`/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1`
  
  # AMP_REGION and AMP_REMOTE_WRITE_ENDPOINT must be set as environment variables
  # in Databricks' cluster "Advanced options"
  # See: https://docs.databricks.com/clusters/configure.html#environment-variables

  envsubst '$AMP_REGION $AMP_REMOTE_WRITE_ENDPOINT $SPARK_LOCAL_IP $DB_CLUSTER_ID $DB_CLUSTER_NAME $DB_IS_DRIVER' < .tmp_adot_config.yaml > adot_config.yaml  
}

function install_adot {
  wget https://aws-otel-collector.s3.amazonaws.com/ubuntu/amd64/v0.25.0/aws-otel-collector.deb
  sudo dpkg -i aws-otel-collector.deb
}

function install_node_exporter {
  wget https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz
  tar zxvf node_exporter-1.5.0.linux-amd64.tar.gz
}

function start_node_exporter {
  nohup ./node_exporter-1.5.0.linux-amd64/node_exporter &
  disown -h
}

function start_adot {
  sudo /opt/aws/aws-otel-collector/bin/aws-otel-collector-ctl -c adot_config.yaml -a start
}

install_adot
install_node_exporter
configure_spark
generate_adot_config_template
configure_adot
start_node_exporter
start_adot
