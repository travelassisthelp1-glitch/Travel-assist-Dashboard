import React, { useEffect, useState } from "react";
import {
  Plane,
  Wallet,
  FileText,
  Users,
  Phone,
  Mail,
  Search,
  Bell,
  Settings,
  ExternalLink,
  Trash2,
  AlertTriangle,
  X,
  Filter,
  ChevronRight,
  Eye,
  MapPin,
  Calendar as CalendarIcon,
  Info,
} from "lucide-react";

interface Booking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  passportInfo: string;
  travelDate: string;
  tripType: string;
  origin: string;
  destination: string;
  seatType: string;
  seatNumber: string;
  seatLocation: string;
  notes: string;
  status: string;
  createdAt: string;
}

const airlines = [
  { name: "Emirates", url: "https://www.emirates.com", region: "International", image: "https://images.unsplash.com/photo-1580438096232-05c088899b10?auto=format&fit=crop&q=80&w=400&h=200" },
  { name: "Qatar Airways", url: "https://www.qatarairways.com", region: "International", image: "https://images.unsplash.com/photo-1524592714635-d77511a4834d?auto=format&fit=crop&q=80&w=400&h=200" },
  { name: "Singapore Airlines", url: "https://www.singaporeair.com", region: "International", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400&h=200" },
  { name: "Delta Air Lines", url: "https://www.delta.com", region: "International", image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=400&h=200" },
  { name: "United Airlines", url: "https://www.united.com", region: "International", image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=400&h=200" },
  { name: "British Airways", url: "https://www.britishairways.com", region: "International", image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=400&h=200" },
  { name: "Lufthansa", url: "https://www.lufthansa.com", region: "International", image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=400&h=200" },
];

export default function Dashboard() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tripTypeFilter, setTripTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.destination.toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query);
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesTripType = tripTypeFilter === "All" || item.tripType === tripTypeFilter;

    return matchesSearch && matchesStatus && matchesTripType;
  }).sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "date-asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!bookingToDelete) return;

    try {
      const response = await fetch(`/api/bookings/${bookingToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData(data.filter((p) => p._id !== bookingToDelete._id));
        setIsDeleteModalOpen(false);
        setBookingToDelete(null);
      } else {
        console.error("Failed to delete booking");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col text-white">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Travel Assist
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "bookings" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <Users className="w-5 h-5" />
            Recent Booking Details
          </button>
          <button
            onClick={() => setActiveTab("airlines")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "airlines" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <Plane className="w-5 h-5" />
            Airlines Portal
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "wallet" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <Wallet className="w-5 h-5" />
            Wallet
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "documents" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <FileText className="w-5 h-5" />
            Documents
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {activeTab.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none w-64"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-sm">
              TA
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Filter className="w-4 h-4" />
                  <span>Filters:</span>
                </div>
                
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Booked">Booked</option>
                </select>

                <select 
                  value={tripTypeFilter}
                  onChange={(e) => setTripTypeFilter(e.target.value)}
                  className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="All">All Trip Types</option>
                  <option value="One Way">One Way</option>
                  <option value="Round Trip">Round Trip</option>
                </select>

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>

                <div className="ml-auto text-sm text-gray-500">
                  Showing {filteredData.length} bookings
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Booking Details
                  </h3>
                </div>

                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading booking data...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                          <th className="px-6 py-4">Passenger</th>
                          <th className="px-6 py-4">Trip Details</th>
                          <th className="px-6 py-4">Seat Info</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredData.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Search className="w-8 h-8 opacity-20" />
                                <p>No bookings match your criteria.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredData.map((item) => (
                            <tr
                              key={item._id}
                              className="hover:bg-indigo-50/30 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <Mail className="w-3 h-3" /> {item.email}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3" /> {item.phone}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                  <span>{item.origin}</span>
                                  <ChevronRight className="w-3 h-3 text-gray-400" />
                                  <span>{item.destination}</span>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <CalendarIcon className="w-3 h-3" /> {item.travelDate}
                                </div>
                                <div className="mt-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                    {item.tripType}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-700">
                                  {item.seatType}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Seat {item.seatNumber} ({item.seatLocation})
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    item.status === "Booked"
                                      ? "bg-green-100 text-green-700"
                                      : item.status === "Contacted"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {item.status || "New"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <a 
                                    href={`tel:${item.phone}`}
                                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                    title="Call Passenger"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </a>
                                  <a 
                                    href={`mailto:${item.email}`}
                                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                    title="Email Passenger"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </a>
                                  <button 
                                    onClick={() => {
                                      setSelectedBooking(item);
                                      setIsDetailsModalOpen(true);
                                    }}
                                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setBookingToDelete(item);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "airlines" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-medium text-gray-900">
                    Airline Booking Portals
                  </h3>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">
                {airlines.map((airline) => (
                  <a
                    key={airline.name}
                    href={airline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 transition-all group bg-white overflow-hidden"
                  >
                    <div className="h-32 w-full relative overflow-hidden bg-gray-100">
                      <img 
                        src={airline.image} 
                        alt={airline.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                      <ExternalLink className="absolute top-3 right-3 w-5 h-5 text-white drop-shadow-md opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-5 flex flex-col flex-1 bg-white">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                          <Plane className="w-4 h-4" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">{airline.name}</h4>
                      </div>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md self-start">{airline.region}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-blue-100 font-medium tracking-wide">
                    Total Balance
                  </h3>
                  <Wallet className="w-6 h-6 text-blue-200" />
                </div>
                <div className="relative z-10">
                  <span className="text-4xl font-bold tracking-tight">
                    ₹0.00
                  </span>
                </div>
                <div className="mt-8 flex gap-3 relative z-10">
                  <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                    Add Funds
                  </button>
                  <button className="flex-1 bg-white text-blue-700 hover:bg-blue-50 transition-colors py-2 rounded-lg text-sm font-medium">
                    Withdraw
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Recent Transactions
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your wallet activity will appear here.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  <h3 className="font-medium text-gray-900">Document Viewer</h3>
                </div>
              </div>
              <iframe
                src="https://mozilla.github.io/pdf.js/web/viewer.html"
                className="w-full flex-1 border-0"
                title="pdf"
              />
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{bookingToDelete?.name}</span>? This action cannot be undone and all associated data will be lost.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Booking Details</h3>
                <p className="text-indigo-100 text-sm mt-1">ID: {selectedBooking._id}</p>
              </div>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Passenger Info */}
                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Passenger Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                        <p className="text-gray-900 font-semibold">{selectedBooking.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                          <p className="text-gray-900 font-medium">{selectedBooking.phone}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                          <p className="text-gray-900 font-medium">{selectedBooking.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Passport Info</label>
                        <p className="text-gray-900 font-medium">{selectedBooking.passportInfo || "N/A"}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Additional Notes
                    </h4>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-600 text-sm">
                      {selectedBooking.notes || "No additional notes provided."}
                    </div>
                  </section>
                </div>

                {/* Flight Info */}
                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Plane className="w-4 h-4" /> Flight Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="text-center">
                          <label className="text-[10px] font-bold text-indigo-400 uppercase block">Origin</label>
                          <span className="text-indigo-900 font-bold">{selectedBooking.origin}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-indigo-300" />
                        <div className="text-center">
                          <label className="text-[10px] font-bold text-indigo-400 uppercase block">Destination</label>
                          <span className="text-indigo-900 font-bold">{selectedBooking.destination}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Travel Date</label>
                          <p className="text-gray-900 font-medium">{selectedBooking.travelDate}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Trip Type</label>
                          <p className="text-gray-900 font-medium">{selectedBooking.tripType}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Seat Assignment
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Class</label>
                        <p className="text-gray-900 font-medium">{selectedBooking.seatType}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Seat</label>
                        <p className="text-gray-900 font-medium">{selectedBooking.seatNumber} ({selectedBooking.seatLocation})</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Booking Status</h4>
                    <div className="flex gap-2">
                      {["New", "Contacted", "Booked"].map((status) => (
                        <button
                          key={status}
                          onClick={async () => {
                            const response = await fetch(`/api/bookings/${selectedBooking._id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status }),
                            });
                            if (response.ok) {
                              setData(data.map(b => b._id === selectedBooking._id ? { ...b, status } : b));
                              setSelectedBooking({ ...selectedBooking, status });
                            }
                          }}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            selectedBooking.status === status 
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="text-[10px] text-gray-400 font-medium">
                Booked on: {new Date(selectedBooking.createdAt).toLocaleString()}
              </div>
              <div className="flex gap-3">
                <a 
                  href={`tel:${selectedBooking.phone}`}
                  className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a 
                  href={`mailto:${selectedBooking.email}`}
                  className="px-6 py-2 bg-white border border-indigo-200 text-indigo-600 text-sm font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
