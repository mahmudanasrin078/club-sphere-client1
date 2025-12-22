import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatCard from "../../../components/dashboard/StatCard";
import { FiUsers, FiDollarSign } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const chartData =
    stats?.membershipsPerClub?.map((item) => ({
      name: item.clubName?.substring(0, 15) || "Unknown",
      members: item.count,
    })) || [];

  return (
    <div>
      <h1 className="text-2xl text-[#38909D] font-bold mb-6">
        Admin <span className="text-[#F6851F] ">Dashboard</span>{" "}
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={FiUsers}
          color="primary"
        />
        <StatCard
          title="Total Clubs"
          value={
            (stats?.totalClubs?.pending || 0) +
            (stats?.totalClubs?.approved || 0) +
            (stats?.totalClubs?.rejected || 0)
          }
          icon={HiOutlineBuildingOffice2}
          color="secondary"
        />
        <StatCard
          title="Total Memberships"
          value={stats?.totalMemberships || 0}
          icon={FiUsers}
          color="accent"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalPayments?.toFixed(2) || "0.00"}`}
          icon={FiDollarSign}
          color="success"
        />
      </div>

      {/* Club Status breakdown */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold text-warning">Pending Clubs</h3>
            <p className="text-3xl font-bold">
              {stats?.totalClubs?.pending || 0}
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold text-success">Approved Clubs</h3>
            <p className="text-3xl font-bold">
              {stats?.totalClubs?.approved || 0}
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold text-error">Rejected Clubs</h3>
            <p className="text-3xl font-bold">
              {stats?.totalClubs?.rejected || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold mb-4">Members per Club</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" fill="#38909D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
