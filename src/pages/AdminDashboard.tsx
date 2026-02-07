import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Download,
  Search,
  Filter,
  LogOut,
  CheckCircle,
  XCircle,
  Cpu,
  Edit,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import {
  fetchRegistrations,
  updateRegistration,
  deleteRegistration,
} from "@/lib/api";

const departments = ["All", "AIML", "CS", "CT", "IT", "BCA", "DCFS", "AIDA"];

const COLORS = ["#00D9FF", "#A855F7", "#F43F5E", "#22C55E", "#F59E0B", "#6366F1", "#EC4899"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teams, setTeams] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin");
    }
    fetchTeams();
  }, [navigate]);

  const fetchTeams = async () => {
    try {
      const data = await fetchRegistrations("", "All");
      const formattedTeams = data.map((t) => ({
        id: t.id,
        teamName: t.team_name,
        leaderName: t.leader_name,
        email: t.email,
        mobile: t.mobile,
        college: t.college,
        leaderDept: t.leader_dept,
        member2Name: t.member2_name,
        member2Dept: t.member2_dept,
        status: t.status,
      }));
      setTeams(formattedTeams);
    } catch (err) {
      console.error("Fetch error:", err);
      toast({
        title: "Load failed",
        description: "Unable to fetch registrations. Please refresh.",
        variant: "destructive",
      });
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leaderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "All" || team.leaderDept === filterDept;
    return matchesSearch && matchesDept;
  });

  const deptCounts = departments.slice(1).map((dept) => ({
    name: dept,
    value: teams.filter((t) => t.leaderDept === dept).length,
  }));

  const handleEditClick = (team: any) => {
    setEditingTeam(team.id);
    setEditFormData({ ...team });
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;

    try {
      await updateRegistration(editFormData.id, {
        team_name: editFormData.teamName,
        leader_name: editFormData.leaderName,
        email: editFormData.email,
        mobile: editFormData.mobile,
        college: editFormData.college,
        leader_dept: editFormData.leaderDept,
        member2_name: editFormData.member2Name,
        member2_dept: editFormData.member2Dept,
      });

      // Update in state
      setTeams(
        teams.map((t) =>
          t.id === editFormData.id ? editFormData : t
        )
      );

      toast({
        title: "Team Updated",
        description: "Team details have been updated successfully",
      });

      setEditingTeam(null);
      setEditFormData(null);
    } catch (err) {
      console.error("Update error:", err);
      toast({
        title: "Error",
        description: "Failed to update team",
        variant: "destructive",
      });
    }
  };

  const handleEditChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditCancel = () => {
    setEditingTeam(null);
    setEditFormData(null);
  };

  const handleDeleteClick = (teamId: number) => {
    setDeleteConfirm(teamId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteRegistration(deleteConfirm);

      // Delete from state
      setTeams(teams.filter((t) => t.id !== deleteConfirm));

      toast({
        title: "Team Deleted",
        description: "Team has been removed successfully",
      });

      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleStatusUpdate = async (teamId: number, status: string) => {
    try {
      await updateRegistration(teamId, { status });

      setTeams(teams.map((t) => (t.id === teamId ? { ...t, status } : t)));
      toast({
        title: "Status Updated",
        description: `Team status has been updated to ${status.replace("_", " ")}`,
      });
    } catch (err) {
      console.error("Update error:", err);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ["Team Name", "Leader", "Email", "Mobile", "College", "Leader Dept", "Member 2", "Member 2 Dept", "Status"],
      ...teams.map((t) => [t.teamName, t.leaderName, t.email, t.mobile, t.college, t.leaderDept, t.member2Name, t.member2Dept, t.status]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hackathon_registrations.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Registrations exported as CSV file",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selected":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Selected</Badge>;
      case "not_selected":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Not Selected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold gradient-text">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => document.getElementById('registrations-table')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Registrations</span>
          </button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage hackathon registrations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="outline" className="lg:hidden" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Teams", value: teams.length, color: "primary" },
            { label: "Selected", value: teams.filter((t) => t.status === "selected").length, color: "green-500" },
            { label: "Pending", value: teams.filter((t) => t.status === "pending").length, color: "yellow-500" },
            { label: "Not Selected", value: teams.filter((t) => t.status === "not_selected").length, color: "red-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4"
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-display font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart and Filters */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="glass-card p-4">
            <h3 className="font-display font-semibold mb-4">Department Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptCounts.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deptCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="lg:col-span-2 glass-card p-4">
            <h3 className="font-display font-semibold mb-4">Search & Filter</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by team or leader name..."
                  className="pl-10 bg-muted/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger className="w-full sm:w-40 bg-muted/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div id="registrations-table" className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold">Registered Teams ({filteredTeams.length})</h3>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={fetchTeams}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Member 2</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading registrations...
                    </TableCell>
                  </TableRow>
                ) : filteredTeams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No registrations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.teamName}</TableCell>
                      <TableCell>
                        <div>
                          <p>{team.leaderName}</p>
                          <p className="text-xs text-muted-foreground">{team.email}</p>
                        </div>
                      </TableCell>
                    <TableCell>{team.leaderDept}</TableCell>
                    <TableCell className="max-w-32 truncate">{team.college}</TableCell>
                    <TableCell>
                      <div>
                        <p>{team.member2Name}</p>
                        <p className="text-xs text-muted-foreground">{team.member2Dept}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(team.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10"
                          onClick={() => handleEditClick(team)}
                          title="Edit team"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/10"
                          onClick={() => handleStatusUpdate(team.id, "selected")}
                          title="Select team"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleStatusUpdate(team.id, "not_selected")}
                          title="Reject team"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteClick(team.id)}
                          title="Delete team"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingTeam && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Edit Team Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditCancel}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Team Name</label>
                  <Input
                    value={editFormData.teamName}
                    onChange={(e) => handleEditChange("teamName", e.target.value)}
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">College</label>
                  <Input
                    value={editFormData.college}
                    onChange={(e) => handleEditChange("college", e.target.value)}
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-4">Team Leader (Member 1)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Leader Name</label>
                    <Input
                      value={editFormData.leaderName}
                      onChange={(e) => handleEditChange("leaderName", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <Select
                      value={editFormData.leaderDept}
                      onValueChange={(value) => handleEditChange("leaderDept", value)}
                    >
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.slice(1).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      value={editFormData.email}
                      onChange={(e) => handleEditChange("email", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mobile</label>
                    <Input
                      value={editFormData.mobile}
                      onChange={(e) => handleEditChange("mobile", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-4">Member 2</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Member 2 Name</label>
                    <Input
                      value={editFormData.member2Name}
                      onChange={(e) => handleEditChange("member2Name", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <Select
                      value={editFormData.member2Dept}
                      onValueChange={(value) => handleEditChange("member2Dept", value)}
                    >
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.slice(1).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleEditCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-sm p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/20 mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-xl font-display font-bold text-center mb-2">Delete Team?</h2>
            <p className="text-muted-foreground text-center mb-6">
              Are you sure you want to delete this team? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete Team
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
