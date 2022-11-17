import { Helmet } from 'react-helmet-async';
import { Icon } from '@iconify/react';
import { faker } from '@faker-js/faker';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Legend,
    Cell, Line
} from 'recharts';
// @mui
import { useTheme } from '@mui/material/styles';
import {Grid, Container, Typography, Stack, Card, MenuItem, TextField} from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import {useEffect, useState} from "react";
import {pieChartDataUpdated, pieChartSelect} from "../sections/@dashboard/blog/BlogPostsSort";
import {BlogPostsSort} from "../sections/@dashboard/blog";
import ReactApexChart from "react-apexcharts";
import {useChart} from "../components/chart";
import {fNumber} from "../utils/formatNumber";
import {StyledChartWrapper} from "../sections/@dashboard/app/AppCurrentVisits";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
    const [sentimentGraphData, setSentimentGraphData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [pieChartSelection, setPieChartSelection] = useState('popcorn');
    const [sentimentSelection, setSentimentSelection] = useState('popcorn');

    const SORT_OPTIONS = [
        { value: 'popcorn', label: 'popcorn' },
        { value: 'pretzel', label: 'pretzel' },
        { value: 'chocolate', label: 'chocolate' },
        { value: 'walnut', label: 'walnut' },
    ];

    const getPieChartData = async (snack) => {
        console.log("Snack: ",snack);
        await fetch("http://127.0.0.1:8000/snack/piechart/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({snack: snack})

        }).then((res) => {
            res.json().then((data) => {
                setPieChartData(data);
                console.log("Data:", data)
            })
        });
    }

    const getData = async (snack) => {
        await fetch("http://127.0.0.1:8000/snack/sentiment/",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({snack:snack})

        }).then((res) => {
            res.json().then((data) => {
                setSentimentGraphData(data);
            })
        });
    }

    useEffect(() => {
        if (pieChartData === null){
            getPieChartData('popcorn').then(r => console.log('initial'))
        }

    },[pieChartData])



    const COLORS = ['#22577A', '#57CC99', '#EF5B5B', '#F28F3B','#C8553D'];


  useEffect( () => {

      if (sentimentGraphData === null){
          getData('popcorn').then(() => console.log(sentimentGraphData));

      }else{
          console.log(sentimentGraphData);
      }


  },[sentimentGraphData]);

    const gradientOffset = () => {
        const dataMax = Math.max(...sentimentGraphData.map((i) => i.doc_sentiment));
        const dataMin = Math.min(...sentimentGraphData.map((i) => i.doc_sentiment));

        if (dataMax <= 0) {
            return 0;
        }
        if (dataMin >= 0) {
            return 1;
        }

        return dataMax / (dataMax - dataMin);
    };


  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
          <Typography variant="h6" sx={{ mb: 2 }}>
              Snack Stats (most mentioned country)
          </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary name="Popcorn" title="North America" total={4905} color="secondary" icon={require('../assets/popcorn.png')} />
          </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary name="Pretzel" title="North America" total={1351} color="info" icon={require('../assets/pretzel.png')} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary name="Chocolate" title="North America" total={761} color="warning" icon={require('../assets/chocolate.png')} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary name="Walnut" title="North America" total={390} color="error" icon={require('../assets/walnut.png')} />
            </Grid>


          <Grid item xs={12} md={6} lg={8}>
              {sentimentGraphData !== null &&
                  <Card>
                      <Typography variant="h4" textAlign={'center'} padding={2}>
                          Sentiment of a snack over a period of time
                      </Typography>
                      <Stack direction="row" alignItems="center" padding={2}>
                          <TextField select size="small" value={sentimentSelection} onChange={(event) => {
                              setSentimentSelection(event.target.value)
                              getData(event.target.value).then(() => console.log(sentimentGraphData));

                          }}>
                              {SORT_OPTIONS.map((options) => (
                                  <MenuItem key={options.value} value={options.value}>
                                      {options.label}
                                  </MenuItem>
                              ))}
                          </TextField>
                      </Stack>
                      <ResponsiveContainer width="100%" height={480} alignSelf={"center"}>
                          <AreaChart
                              width={1200}
                              height={500}
                              data={sentimentGraphData}
                              margin={{
                                  top: 10,
                                  right: 30,
                                  left: 5,
                                  bottom: 5,
                              }}
                          >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="doc_date" />
                              <YAxis />
                              <Tooltip />
                              <defs>
                                  <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset={gradientOffset()} stopColor="green" stopOpacity={1} />
                                      <stop offset={gradientOffset()} stopColor="red" stopOpacity={1} />
                                  </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="doc_sentiment" stroke="#000" fill="url(#splitColor)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </Card>
              }


          </Grid>

          <Grid item xs={12} md={6} lg={4}>
              {pieChartData !== null &&
                  <Card>
                      <Stack mb={0} direction="row" alignItems="center" padding={2}>
                          <TextField select size="small" value={pieChartSelection} onChange={(event) => {
                              setPieChartSelection(event.target.value)
                              getPieChartData(event.target.value).then(r => console.log('updated-noww'));

                          }}>
                              {SORT_OPTIONS.map((options) => (
                                  <MenuItem key={options.value} value={options.value}>
                                      {options.label}
                                  </MenuItem>
                              ))}
                          </TextField>
                      </Stack>
                      <div style={{ width: '100%', height: 550 }}>
                          <ResponsiveContainer>
                              <PieChart width={400} height={400}>
                                  <Legend iconSize={14} layout="horizontal"  align="center" />
                                  <Pie
                                      dataKey="value"
                                      data={pieChartData}
                                      fill="#8884d8"
                                  >
                                      {pieChartData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}

                                  </Pie>
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                  </Card>
              }


          </Grid>

          {/*<Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>*/}

          {/*<Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>*/}
            {/*Grid item xs={12} md={6} lg={4}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>*/}

          {/*<Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>*/}
        </Grid>
      </Container>
    </>
  );
}
