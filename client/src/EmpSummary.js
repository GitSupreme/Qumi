import {
    UserSwitchOutlined,
    HeartOutlined,
    UserOutlined,
  } from "@ant-design/icons";
  import { Box } from "@mui/material";
  import { Card, Space, Statistic, Table, Typography } from "antd";
  import { useEffect, useState } from "react";
  import { getCustomers, getInventory, getOrders, getRevenue } from "API";
  import Navtab from "scenes/navtab";
  import Footer from "scenes/footer";
  
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Bar } from "react-chartjs-2";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  function EmpSummary() {
    const [orders, setOrders] = useState(0);
    const [inventory, setInventory] = useState(0);
    const [customers, setCustomers] = useState(0);
    const [revenue, setRevenue] = useState(0);
  
    useEffect(() => {
      getOrders().then((res) => {
        setOrders(res.total);
        setRevenue(res.discountedTotal);
      });
      getInventory().then((res) => {
        setInventory(res.total);
      });
      getCustomers().then((res) => {
        setCustomers(res.total);
      });
    }, []);
  
    return (
        <Box>
        <Navtab />
      <Space size={40} direction="vertical" style={{marginLeft: "50px", marginTop: "10px", marginBottom: "40px"}}>
        <Typography.Title level={3}>Queue Stats</Typography.Title>
        <Space direction="horizontal" style={{justifyContent: "center", alignItems: "center", marginTop: "2px"}}>
          <DashboardCard
            icon={
              <UserOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0,255,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={" Total Users"}
            value={orders}
          />
          <DashboardCard
            icon={
              <HeartOutlined
                style={{
                  color: "blue",
                  backgroundColor: "rgba(0,0,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Active Customers"}
            value={inventory}
          />
          <DashboardCard
            icon={
              <UserSwitchOutlined
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Current Users in Queue"}
            value={customers}
          />
        </Space>
        <Space>
          <RecentOrders />
          <DashboardChart />
        </Space>
      </Space>
      <Footer />
      </Box>
    );
  }
  
  function DashboardCard({ title, value, icon }) {
    return (
      <Card>
        <Space direction="horizontal">
          {icon}
          <Statistic title={title} value={value} />
        </Space>
      </Card>
    );
  }
  function RecentOrders() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
      getOrders().then((res) => {
        setDataSource(res.products.splice(0, 3));
        setLoading(false);
      });
    }, []);
  
    return (
      <>
        <Typography.Text>Recent Additions to Queue</Typography.Text>
        <Table
          columns={[
            {
              title: "Name",
              dataIndex: "name",
            },
            {
              title: "Phone Number",
              dataIndex: "phone",
            },
            {
              title: "Email",
              dataIndex: "demail",
            },
          ]}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
        ></Table>
      </>
    );
  }
  
  function DashboardChart() {
    const [reveneuData, setReveneuData] = useState({
      labels: [],
      datasets: [],
    });
  
    useEffect(() => {
      getRevenue().then((res) => {
        const labels = res.carts.map((cart) => {
          return `User-${cart.userId}`;
        });
        const data = res.carts.map((cart) => {
          return cart.discountedTotal;
        });
  
        const dataSource = {
          labels,
          datasets: [
            {
              label: "Queue Position",
              data: data,
              backgroundColor: "rgba(255, 0, 0, 1)",
            },
          ],
        };
  
        setReveneuData(dataSource);
      });
    }, []);
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Queue Position",
        },
      },
    };
  
    return (
      <Card style={{ width: 500, height: 250 }}>
        <Bar options={options} data={reveneuData} />
      </Card>
    );
  }
  export default EmpSummary;