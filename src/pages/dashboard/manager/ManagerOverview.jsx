import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatCard from "../../../components/dashboard/StatCard";
import { FiUsers, FiCalendar, FiDollarSign } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

const ManagerOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["managerStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/stats");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#38909D] mb-6">
        Manager <span className=" text-[#F6851F]">Dashboard</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Clubs"
          value={stats?.totalClubs || 0}
          icon={HiOutlineBuildingOffice2}
          color="primary"
        />
        <StatCard
          title="Total Members"
          value={stats?.totalMembers || 0}
          icon={FiUsers}
          color="secondary"
        />
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          icon={FiCalendar}
          color="accent"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalPayments?.toFixed(2) || "0.00"}`}
          icon={FiDollarSign}
          color="success"
        />
      </div>
    </div>
  );
};

export default ManagerOverview;
