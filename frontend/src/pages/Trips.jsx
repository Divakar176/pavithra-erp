import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { generateInvoice, setupHeader } from '../utils/pdfGenerator';
import { Navigation, Plus, Search, Filter, ArrowUpRight, Clock, CheckCircle, MapPin, X, UploadCloud, Sparkles, FileText, CheckSquare, Square, Check, Pencil, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import SecurityPinModal from '../components/SecurityPinModal';

const Trips = () => {
    const location = useLocation();
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isScanningBill, setIsScanningBill] = useState(false);
    const [selectedTrips, setSelectedTrips] = useState([]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // { type: 'edit' | 'delete', trip: obj }

    const [filters, setFilters] = useState({
        date: '',
        vehicleId: '',
        customerId: '',
        driverId: '',
        site: ''
    });

    const [newTrip, setNewTrip] = useState({
        vehicleId: '',
        driverName: '',
        customerName: '',
        source: '',
        destination: '',
        material: 'Blue Metal',
        loadWeight: '',
        tripCharges: '',
        hourlyRate: '',
        dailyRate: '',
        numberOfDays: '1',
        machineryBillingMode: 'HOURLY',
        dieselCost: '',
        status: 'PENDING',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        breakHours: '1',
        driverSalary: '',
        foodAmount: '',
        materialPurchaseCost: '',
        calculationType: 'TIME',
        startMeter: '',
        endMeter: '',
        manualTotalHours: ''
    });

    const fetchTrips = async () => {
        try {
            const response = await api.get('/trips');
            const sorted = response.data.sort((a, b) => {
                if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
                if (a.status !== 'IN_PROGRESS' && b.status === 'IN_PROGRESS') return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setTrips(sorted);
        } catch (error) {
            console.error("Error fetching trips", error);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [vehRes, custRes, drvRes] = await Promise.all([
                api.get('/vehicles'),
                api.get('/customers'),
                api.get('/users/drivers')
            ]);
            setVehicles(vehRes.data);
            setCustomers(custRes.data);
            setDrivers(drvRes.data);

            if (vehRes.data.length > 0) setNewTrip(prev => ({ ...prev, vehicleId: vehRes.data[0].id }));
            if (drvRes.data.length > 0) setNewTrip(prev => ({ ...prev, driverName: drvRes.data[0].username }));

        } catch (error) {
            console.error("Error fetching dropdown data", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchTrips();
            await fetchDropdownData();
            setIsLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (location.state?.openAddTrip && location.state?.vehicleId) {
            setNewTrip(prev => ({ ...prev, vehicleId: location.state.vehicleId }));
            setIsAddModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        if (newTrip.vehicleId && vehicles.length > 0) {
            const v = vehicles.find(veh => veh.id.toString() === newTrip.vehicleId.toString());
            if (v && (v.type === 'JCB' || v.type === 'Harvesting Machine' || v.type === 'Tractor')) {
                if (v.billingType === 'PER_TRIP') {
                    setNewTrip(prev => ({ ...prev, machineryBillingMode: 'TRIP' }));
                } else if (v.billingType === 'HOURLY') {
                    setNewTrip(prev => ({ ...prev, machineryBillingMode: 'HOURLY' }));
                }
            }
        }
    }, [newTrip.vehicleId, vehicles]);


    const selectedVehicle = vehicles.find(v => v.id.toString() === newTrip.vehicleId.toString());
    const isMachinery = selectedVehicle && (
        selectedVehicle.type.trim().toLowerCase() === 'jcb' || 
        selectedVehicle.type.trim().toLowerCase() === 'harvesting machine' || 
        selectedVehicle.type.trim().toLowerCase() === 'tractor'
    );
    const isMonthly = selectedVehicle && selectedVehicle.billingType === 'MONTHLY';
    const isBikeOrCar = selectedVehicle && (selectedVehicle.type === 'Bikes' || selectedVehicle.type === 'Cars');
    const isTipper = selectedVehicle && (selectedVehicle.type === 'Tipper' || selectedVehicle.type === 'Tipper Lorry') && selectedVehicle.billingType === 'PER_TRIP';


    // Calculate total hours for machinery
    const calculateHours = (start, end, breakH) => {
        if (!start || !end) return 0;
        const [sH, sM] = start.split(':').map(Number);
        const [eH, eM] = end.split(':').map(Number);

        const startMins = sH * 60 + sM;
        let endMins = eH * 60 + eM;

        // Handle overnight shifts (e.g. 20:00 to 06:00)
        if (endMins < startMins) {
            endMins += 24 * 60;
        }

        let diffMins = endMins - startMins;
        let totalHrs = (diffMins / 60) - (parseFloat(breakH) || 0);
        return Math.max(0, totalHrs).toFixed(2);
    };

    const calculatedTotalHours = (isMachinery && newTrip.machineryBillingMode === 'HOURLY') ? (
        newTrip.calculationType === 'METER' ?
            Math.max(0, (parseFloat(newTrip.endMeter) || 0) - (parseFloat(newTrip.startMeter) || 0)).toFixed(2)
            : newTrip.calculationType === 'MANUAL' ?
                (parseFloat(newTrip.manualTotalHours) || 0).toFixed(2)
                : calculateHours(newTrip.startTime, newTrip.endTime, newTrip.breakHours)
    ) : null;

    useEffect(() => {
        if (isMachinery && newTrip.machineryBillingMode === 'HOURLY') {
            const calculated = ((parseFloat(calculatedTotalHours) || 0) * (parseFloat(newTrip.hourlyRate) || 0)).toFixed(0);
            if (calculated > 0) {
                setNewTrip(prev => ({ ...prev, tripCharges: calculated }));
            }
        }
    }, [calculatedTotalHours, newTrip.hourlyRate, isMachinery, newTrip.machineryBillingMode]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanningBill(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/ai/ocr/extract-trip', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const data = response.data;

            const matchedCustomer = customers.find(c => c.name.toLowerCase().includes(data.customerName.toLowerCase()));
            const matchedVehicle = vehicles.find(v => v.vehicleNumber.replace(/\s/g, '').toLowerCase() === data.vehicleNumber.replace(/\s/g, '').toLowerCase());

            setNewTrip(prev => ({
                ...prev,
                customerId: matchedCustomer ? matchedCustomer.id : prev.customerId,
                vehicleId: matchedVehicle ? matchedVehicle.id : prev.vehicleId,
                material: data.material || prev.material,
                loadWeight: data.loadWeightTons || prev.loadWeight,
                startDate: data.date ? new Date(data.date).toISOString().split('T')[0] : prev.startDate
            }));

            alert(`✅ AI extracted data from Weighment Slip successfully!`);
        } catch (error) {
            console.error("AI extraction failed", error);
            alert("Failed to extract data from bill. Please enter manually.");
        } finally {
            setIsScanningBill(false);
            e.target.value = null;
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!newTrip.vehicleId) {
            alert("Please select a vehicle!");
            setIsSubmitting(false);
            return;
        }

        try {
            const existingCustomer = customers.find(c => c.name && c.name.toLowerCase() === (isBikeOrCar ? 'Internal' : newTrip.customerName).toLowerCase());
            const customerPayload = existingCustomer ? { id: existingCustomer.id } : { name: isBikeOrCar ? 'Internal' : newTrip.customerName };

            const existingDriver = drivers.find(d => d.username && d.username.toLowerCase() === newTrip.driverName.toLowerCase());
            const driverPayload = existingDriver ? { id: existingDriver.id } : { username: newTrip.driverName };

            const payload = {
                vehicle: { id: newTrip.vehicleId },
                driver: driverPayload,
                customer: customerPayload,
                source: newTrip.source,
                destination: isMachinery || isBikeOrCar ? "-" : newTrip.destination,
                material: isMachinery || isBikeOrCar ? "-" : newTrip.material,
                loadWeight: isMachinery || isBikeOrCar ? 0 : parseFloat(newTrip.loadWeight),
                tripCharges: isBikeOrCar ? 0 : parseFloat(newTrip.tripCharges || 0),
                paymentStatus: "UNPAID",
                startDate: newTrip.startDate,
                startTime: (isMachinery && newTrip.machineryBillingMode === 'HOURLY' && (newTrip.calculationType === 'TIME' || !newTrip.calculationType)) ? newTrip.startTime : null,
                endTime: (isMachinery && newTrip.machineryBillingMode === 'HOURLY' && (newTrip.calculationType === 'TIME' || !newTrip.calculationType)) ? newTrip.endTime : null,
                startMeter: (isMachinery && newTrip.machineryBillingMode === 'HOURLY' && newTrip.calculationType === 'METER') ? parseFloat(newTrip.startMeter) : null,
                endMeter: (isMachinery && newTrip.machineryBillingMode === 'HOURLY' && newTrip.calculationType === 'METER') ? parseFloat(newTrip.endMeter) : null,
                breakHours: (isMachinery && newTrip.machineryBillingMode === 'HOURLY' && (newTrip.calculationType === 'TIME' || !newTrip.calculationType)) ? parseFloat(newTrip.breakHours) : null,
                totalHours: (isMachinery && newTrip.machineryBillingMode === 'HOURLY') ? parseFloat(calculatedTotalHours) : null,
                dieselCost: parseFloat(newTrip.dieselCost || 0),
                status: newTrip.status,
                driverSalary: isBikeOrCar ? 0 : parseFloat(newTrip.driverSalary || 0),
                foodAmount: isBikeOrCar ? 0 : parseFloat(newTrip.foodAmount || 0),
                materialPurchaseCost: isBikeOrCar || !isTipper ? 0 : parseFloat(newTrip.materialPurchaseCost || 0)
            };

            await api.post('/trips', payload);
            setIsAddModalOpen(false);

            await fetchDropdownData();
            await fetchTrips();

            setNewTrip({
                vehicleId: vehicles[0]?.id || '',
                driverName: drivers[0]?.username || '',
                customerName: '',
                source: '',
                destination: '',
                material: 'Blue Metal',
                loadWeight: '',
                tripCharges: '',
                hourlyRate: '',
                dailyRate: '',
                numberOfDays: '1',
                machineryBillingMode: 'HOURLY',
                dieselCost: '',
                status: 'PENDING',
                startDate: new Date().toISOString().split('T')[0],
                startTime: '',
                endTime: '',
                breakHours: '1',
                driverSalary: '',
                foodAmount: '',
                materialPurchaseCost: '',
                calculationType: 'TIME',
                startMeter: '',
                endMeter: '',
                manualTotalHours: ''
            });
        } catch (error) {
            console.error("Failed to add trip", error);
            alert("Failed to add trip. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTripSelection = (tripId) => {
        setSelectedTrips(prev =>
            prev.includes(tripId) ? prev.filter(id => id !== tripId) : [...prev, tripId]
        );
    };

    const handlePaymentStatusUpdate = async (tripId, newPaymentStatus) => {
        try {
            await api.patch(`/trips/${tripId}/payment-status?paymentStatus=${newPaymentStatus}`);
            await fetchTrips();
        } catch (error) {
            console.error("Error updating payment status", error);
            alert("Failed to update payment status");
        }
    };

    const handleGenerateInvoice = () => {
        const tripsToInvoice = trips.filter(t => selectedTrips.includes(t.id));
        if (tripsToInvoice.length === 0) return;

        const customer = tripsToInvoice[0].customer;
        const allSameCustomer = tripsToInvoice.every(t => t.customer?.id === customer?.id);
        if (!allSameCustomer) {
            const uniqueCustomers = [...new Set(tripsToInvoice.map(t => t.customer?.name || 'Walk-in'))];
            alert(`You have selected trips from multiple customers (${uniqueCustomers.join(', ')}). Please select trips for only one customer to generate an invoice. Tip: Click 'Clear Selection' and try again.`);
            return;
        }

        const doc = new jsPDF();

        let currentY = setupHeader(doc, "TAX INVOICE");

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 14, currentY, { align: 'right' });
        doc.text(`Invoice #: INV-${Date.now().toString().slice(-6)}`, 14, currentY);
        currentY += 15;

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFillColor(240, 240, 240);
        doc.rect(14, currentY, doc.internal.pageSize.width - 28, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text("Bill To:", 16, currentY + 6);
        currentY += 12;

        doc.setFontSize(10);
        doc.text(`${customer?.name || 'Walk-in Customer'}`, 14, currentY);
        doc.setFont('helvetica', 'normal');
        if (customer?.mobile) doc.text(`Phone: ${customer.mobile}`, 14, currentY + 5);
        if (customer?.gstNumber) doc.text(`GST: ${customer.gstNumber}`, 14, currentY + 10);
        currentY += 20;

        const hasMachinery = tripsToInvoice.some(t => t.vehicle?.type === 'JCB' || t.vehicle?.type === 'Harvesting Machine');
        const hasTipper = tripsToInvoice.some(t => t.vehicle?.type === 'Tipper' || t.vehicle?.type === 'Lorry');
        const isPureMachinery = hasMachinery && !hasTipper;

        let detailColumnName = "Tonnage";
        if (isPureMachinery) detailColumnName = "Total Hours";
        else if (hasMachinery && hasTipper) detailColumnName = "Tons / Hrs";

        const tableColumn = isPureMachinery
            ? ["Date", "Vehicle", "Route / Site", detailColumnName, "Amount"]
            : ["Date", "Vehicle", "Route / Site", "Material", detailColumnName, "Amount"];

        const tableRows = [];
        let totalAmount = 0;

        tripsToInvoice.forEach(t => {
            const amount = t.tripCharges || 0;
            totalAmount += amount;

            let route = t.source || "-";
            if (t.destination && t.destination !== "-") {
                route += ` to ${t.destination}`;
            }

            const isMachine = t.vehicle?.type === 'JCB' || t.vehicle?.type === 'Harvesting Machine';
            let detailValue = "-";
            if (isMachine) {
                detailValue = t.totalHours ? `${t.totalHours} Hrs` : "-";
            } else {
                detailValue = t.loadWeight ? `${t.loadWeight} Tons` : "-";
            }

            const rowData = [
                new Date(t.startDate).toLocaleDateString(),
                t.vehicle?.vehicleNumber || "-",
                route
            ];

            if (!isPureMachinery) {
                rowData.push(t.material || "-");
            }

            rowData.push(detailValue);
            rowData.push(`Rs. ${amount.toFixed(2)}`);

            tableRows.push(rowData);
        });

        autoTable(doc, {
            startY: currentY,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [216, 98, 28] }
        });

        const finalY = doc.lastAutoTable.finalY || 70;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Amount Due: Rs. ${totalAmount.toFixed(2)}`, 14, finalY + 10);

        doc.save(`Invoice_${customer?.name || 'Customer'}_${new Date().toISOString().split('T')[0]}.pdf`);
        setSelectedTrips([]);
    };

    const handleStatusChange = async (trip) => {
        let nextStatus = '';
        if (trip.status === 'PENDING') nextStatus = 'IN_PROGRESS';
        else if (trip.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';
        else return;

        try {
            await api.patch(`/trips/${trip.id}/status?status=${nextStatus}`);
            fetchTrips();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status.");
        }
    };

    const handleEditClick = (trip) => {
        setPendingAction({ type: 'edit', trip });
        setIsSecurityModalOpen(true);
    };

    const handleDeleteClick = (trip) => {
        setPendingAction({ type: 'delete', trip });
        setIsSecurityModalOpen(true);
    };

    const handleSecuritySuccess = async () => {
        setIsSecurityModalOpen(false);
        if (pendingAction?.type === 'delete') {
            await confirmDelete(pendingAction.trip.id);
        } else if (pendingAction?.type === 'edit') {
            setEditingTrip(pendingAction.trip);
            setIsEditModalOpen(true);
        }
        setPendingAction(null);
    };

    const confirmDelete = async (id) => {
        try {
            await api.delete(`/trips/${id}`);
            fetchTrips();
        } catch (error) {
            console.error("Failed to delete trip", error);
            alert("Failed to delete trip.");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/trips/${editingTrip.id}`, {
                ...editingTrip,
                customer: { id: editingTrip.customer?.id, name: editingTrip.customer?.name },
                driver: { id: editingTrip.driver?.id, username: editingTrip.driver?.username },
                vehicle: { id: editingTrip.vehicle?.id }
            });
            setIsEditModalOpen(false);
            setEditingTrip(null);
            fetchTrips();
        } catch (error) {
            console.error("Failed to update trip", error);
            alert("Failed to update trip.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#121212]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8621C]"></div>
            </div>
        );
    }

    const todayTrips = trips.filter(t => t.status === 'IN_PROGRESS' || t.status === 'PENDING').length;
    const completedTrips = trips.filter(t => t.status === 'COMPLETED').length;

    const filteredTrips = trips.filter(trip => {
        if (filters.date && trip.startDate !== filters.date) return false;
        if (filters.vehicleId && trip.vehicle?.id.toString() !== filters.vehicleId) return false;
        if (filters.customerId && trip.customer?.id.toString() !== filters.customerId) return false;
        if (filters.driverId && trip.driver?.id.toString() !== filters.driverId) return false;
        if (filters.site && !trip.source?.toLowerCase().includes(filters.site.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="p-8 w-full mx-auto space-y-6 relative">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-3">
                        <Navigation className="w-6 h-6 text-[#D8621C]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Trips Management</h2>
                        <p className="text-sm text-gray-400">{todayTrips} Active | {completedTrips} Completed</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-[#D8621C] text-white rounded-xl text-sm font-medium hover:bg-[#c25617] transition-colors shadow-lg shadow-orange-500/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Trip
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-4 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[140px]">
                    <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
                    <input
                        type="date"
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8621C]"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                </div>
                <div className="flex-1 min-w-[140px]">
                    <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Vehicle</label>
                    <select
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8621C]"
                        value={filters.vehicleId}
                        onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}
                    >
                        <option value="">All Vehicles</option>
                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.type})</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                    <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Customer</label>
                    <select
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8621C]"
                        value={filters.customerId}
                        onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}
                    >
                        <option value="">All Customers</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                    <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Driver</label>
                    <select
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8621C]"
                        value={filters.driverId}
                        onChange={(e) => setFilters({ ...filters, driverId: e.target.value })}
                    >
                        <option value="">All Drivers</option>
                        {drivers.map(d => <option key={d.id} value={d.id}>{d.username}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                    <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Site / Source</label>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8621C]"
                        value={filters.site}
                        onChange={(e) => setFilters({ ...filters, site: e.target.value })}
                    />
                </div>
                <div>
                    <button
                        onClick={() => setFilters({ date: '', vehicleId: '', customerId: '', driverId: '', site: '' })}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-[#2A2A2A] rounded-lg hover:bg-[#333] transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="stripe-card overflow-hidden border border-[#2A2A2A] bg-[#1C1C1C]">
                <div className="p-4 border-b border-[#2A2A2A] bg-[#151515]">
                    <h3 className="text-white font-semibold flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        Today's Trip Status <span className="ml-2 text-xs bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Live</span>
                    </h3>
                </div>

                {selectedTrips.length > 0 && (
                    <div className="bg-[#D8621C]/10 border-b border-[#D8621C]/20 px-4 py-3 flex justify-between items-center">
                        <span className="text-[#D8621C] font-semibold text-sm">{selectedTrips.length} trip(s) selected</span>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedTrips([])} className="bg-transparent border border-[#D8621C] text-[#D8621C] hover:bg-[#D8621C]/10 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors">
                                <X className="w-4 h-4 mr-1" /> Clear Selection
                            </button>
                            <button onClick={handleGenerateInvoice} className="bg-[#D8621C] hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg">
                                <FileText className="w-4 h-4 mr-2" /> Generate Invoice
                            </button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto bg-white shadow-sm border border-gray-300">
                    <table className="w-full text-sm text-left text-black border-collapse">
                        <thead className="text-xs text-black bg-gray-100 uppercase border-b border-gray-300">
                            <tr>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300 w-10"></th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Date</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Vehicle / Type</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Driver</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Route / Site</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Customer</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Expected</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Diesel Cost</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Est. Profit</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Payment</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Status</th>
                                <th className="px-6 py-4 font-bold tracking-wider border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrips.length > 0 ? filteredTrips.map((trip) => {
                                const dieselCost = trip.dieselCost || 0;
                                const isMonthly = trip.vehicle && trip.vehicle.billingType === 'MONTHLY';
                                const isPersonalVehicle = trip.vehicle && (trip.vehicle.type === 'Bikes' || trip.vehicle.type === 'Cars');
                                const estProfit = isMonthly || isPersonalVehicle ? 0 : ((trip.tripCharges || 0) - dieselCost - (trip.driverSalary || 0) - (trip.foodAmount || 0) - (trip.materialPurchaseCost || 0));
                                const isMachineTrip = trip.vehicle?.type === 'JCB' || trip.vehicle?.type === 'Harvesting Machine' || trip.vehicle?.type === 'Tractor';

                                return (
                                    <tr key={trip.id} className="hover:bg-blue-50 transition-colors group">
                                        <td className="px-6 py-4 border border-gray-300 text-center cursor-pointer" onClick={() => toggleTripSelection(trip.id)}>
                                            {selectedTrips.includes(trip.id) ? (
                                                <CheckSquare className="w-5 h-5 text-[#D8621C]" />
                                            ) : (
                                                <Square className="w-5 h-5 text-gray-400" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                                            <div className="text-black font-medium">
                                                {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                                            <div className="text-black font-bold">{trip.vehicle?.vehicleNumber}</div>
                                            <div className="text-xs text-gray-600 mt-1">{trip.vehicle?.type}</div>
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <div className="text-black font-medium">{trip.driver?.username}</div>
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <div className="flex flex-col text-black">
                                                {isMachineTrip ? (
                                                    <>
                                                        <span className="font-semibold text-black">{trip.source}</span>
                                                        <span className="text-xs text-orange-600 mt-1">
                                                            {trip.startTime && trip.endTime ? `${trip.startTime} to ${trip.endTime} (${trip.totalHours} Hrs)` :
                                                                trip.startMeter && trip.endMeter ? `Meter: ${trip.startMeter} to ${trip.endMeter} (${trip.totalHours} Hrs)` :
                                                                    `${trip.totalHours || 0} Hrs Total`}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <span className="truncate max-w-[80px]" title={trip.source}>{trip.source}</span>
                                                        <ArrowUpRight className="w-3 h-3 mx-2 text-gray-400 shrink-0" />
                                                        <span className="truncate max-w-[80px]" title={trip.destination}>{trip.destination}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <div className="text-black truncate max-w-[120px]" title={trip.customer?.name}>
                                                {trip.customer?.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            {isMonthly ? (
                                                <span className="text-blue-700 text-xs font-bold uppercase tracking-wider bg-blue-100 px-2 py-1 rounded-md border border-blue-200">MONTHLY</span>
                                            ) : isPersonalVehicle ? (
                                                <span className="text-gray-500 text-xs">-</span>
                                            ) : (
                                                <div className="text-black font-semibold">{formatCurrency(trip.tripCharges)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <div className="text-red-600">
                                                {formatCurrency(dieselCost)}
                                                {trip.dieselCost == null && <span className="text-[10px] text-gray-500 ml-1">(est)</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            {isMonthly || isPersonalVehicle ? (
                                                <span className="text-gray-500 text-xs">-</span>
                                            ) : (
                                                <div className="text-[#059669] font-semibold">{formatCurrency(estProfit)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <div className="flex flex-col items-start gap-1">
                                                {trip.paymentStatus === 'PAID' ? (
                                                    <span className="text-green-700 text-[10px] font-bold bg-green-100 px-2 py-0.5 rounded border border-green-200 flex items-center">
                                                        <Check className="w-3 h-3 mr-1" /> PAID
                                                    </span>
                                                ) : (
                                                    <span className="text-red-700 text-[10px] font-bold bg-red-100 px-2 py-0.5 rounded border border-red-200">UNPAID</span>
                                                )}
                                                <button
                                                    onClick={() => handlePaymentStatusUpdate(trip.id, trip.paymentStatus === 'PAID' ? 'UNPAID' : 'PAID')}
                                                    className="text-[10px] text-blue-600 underline hover:text-blue-800"
                                                >
                                                    {trip.paymentStatus === 'PAID' ? 'Mark Unpaid' : 'Mark Paid'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <button
                                                onClick={() => handleStatusChange(trip)}
                                                disabled={trip.status === 'COMPLETED'}
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${trip.status === 'COMPLETED' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 cursor-default' :
                                                        trip.status === 'IN_PROGRESS' ? 'bg-[#D8621C]/10 text-[#D8621C] border border-[#D8621C]/20 hover:bg-[#D8621C]/20 cursor-pointer' :
                                                            'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 hover:bg-yellow-500/20 cursor-pointer'
                                                    }`}
                                                title={trip.status !== 'COMPLETED' ? 'Click to advance status' : ''}
                                            >
                                                {trip.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                {trip.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditClick(trip)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded-lg border border-blue-200 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(trip)} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg border border-red-200 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="12" className="px-6 py-12 text-center text-gray-500">
                                        <Navigation className="w-8 h-8 mx-auto mb-3 text-gray-600 opacity-50" />
                                        <p>No trips found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Trip Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl w-full max-w-lg shadow-2xl h-max max-h-[90vh] flex flex-col">
                        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#151515] sticky top-0 rounded-t-2xl z-10">
                            <h2 className="text-white font-bold text-lg">Add New Trip</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 border-b border-[#2A2A2A] bg-orange-500/5 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-sm font-bold text-orange-400 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Smart Auto-Fill
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Upload a Weighment Slip to auto-fill</p>
                            </div>
                            <label className={`cursor-pointer px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors border border-orange-500/30 flex items-center gap-2 ${isScanningBill ? 'opacity-50 pointer-events-none' : ''}`}>
                                {isScanningBill ? (
                                    <><div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div> Scanning...</>
                                ) : (
                                    <><UploadCloud className="w-4 h-4" /> Scan Slip</>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isScanningBill} />
                            </label>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newTrip.startDate}
                                        onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Vehicle</label>
                                    <select
                                        required
                                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newTrip.vehicleId}
                                        onChange={(e) => setNewTrip({ ...newTrip, vehicleId: e.target.value })}
                                    >
                                        <option value="">Select Vehicle...</option>
                                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.type})</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                                        {selectedVehicle?.type === 'Bikes' || selectedVehicle?.type === 'Cars' ? 'Rider / Driver' : 'Driver'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        list="driver-list"
                                        placeholder="Type new driver or select from list..."
                                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newTrip.driverName}
                                        onChange={(e) => setNewTrip({ ...newTrip, driverName: e.target.value })}
                                    />
                                    <datalist id="driver-list">
                                        {drivers.map(d => <option key={d.id} value={d.username} />)}
                                    </datalist>
                                    <p className="text-[10px] text-gray-500 mt-1 ml-2">Type a new name to automatically create a driver.</p>
                                </div>
                                {!isBikeOrCar && (
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Customer</label>
                                        <input
                                            type="text"
                                            required
                                            list="customer-list"
                                            placeholder="Type new customer or select from list..."
                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newTrip.customerName}
                                            onChange={(e) => setNewTrip({ ...newTrip, customerName: e.target.value })}
                                        />
                                        <datalist id="customer-list">
                                            {customers.map(c => <option key={c.id} value={c.name} />)}
                                        </datalist>
                                        <p className="text-[10px] text-gray-500 mt-1 ml-2">Type a new name to automatically create a customer.</p>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Fields based on Vehicle Type */}
                            {isMachinery ? (
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div className="col-span-4 flex items-center gap-4 bg-[#1C1C1C] p-4 rounded-xl border border-[#2A2A2A]">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Billing Mode:</span>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="machineryBillingMode" value="HOURLY"
                                                    checked={newTrip.machineryBillingMode === 'HOURLY'}
                                                    onChange={() => setNewTrip({ ...newTrip, machineryBillingMode: 'HOURLY' })}
                                                    className="accent-[#D8621C]" />
                                                <span className={`text-sm ${newTrip.machineryBillingMode === 'HOURLY' ? 'text-white font-bold' : 'text-gray-400'}`}>Hour Wise</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="machineryBillingMode" value="DAILY"
                                                    checked={newTrip.machineryBillingMode === 'DAILY'}
                                                    onChange={() => setNewTrip({ ...newTrip, machineryBillingMode: 'DAILY' })}
                                                    className="accent-[#D8621C]" />
                                                <span className={`text-sm ${newTrip.machineryBillingMode === 'DAILY' ? 'text-white font-bold' : 'text-gray-400'}`}>Per Day Wise</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="machineryBillingMode" value="TRIP"
                                                    checked={newTrip.machineryBillingMode === 'TRIP'}
                                                    onChange={() => setNewTrip({ ...newTrip, machineryBillingMode: 'TRIP' })}
                                                    className="accent-[#D8621C]" />
                                                <span className={`text-sm ${newTrip.machineryBillingMode === 'TRIP' ? 'text-white font-bold' : 'text-gray-400'}`}>Trip Wise</span>
                                            </label>
                                        </div>
                                    </div>
                            ) : null}

                            {/* Fields based on condition */}
                            {isMachinery && newTrip.machineryBillingMode !== 'TRIP' && !isMonthly ? (
                                <>
                                    <div className="grid grid-cols-1 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Site Location</label>
                                            <input
                                                type="text" required placeholder="e.g. Kodur Site"
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.source} onChange={(e) => setNewTrip({ ...newTrip, source: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {newTrip.machineryBillingMode === 'HOURLY' && (
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-4 flex items-center gap-4 mb-2">
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">Calculate By:</span>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="calcType" value="TIME"
                                                        checked={newTrip.calculationType === 'TIME' || !newTrip.calculationType}
                                                        onChange={() => setNewTrip({ ...newTrip, calculationType: 'TIME' })}
                                                        className="accent-[#D8621C]" />
                                                    <span className="text-sm text-white">Time (HH:MM)</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="calcType" value="METER"
                                                        checked={newTrip.calculationType === 'METER'}
                                                        onChange={() => setNewTrip({ ...newTrip, calculationType: 'METER' })}
                                                        className="accent-[#D8621C]" />
                                                    <span className="text-sm text-white">Meter Reading</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="calcType" value="MANUAL"
                                                        checked={newTrip.calculationType === 'MANUAL'}
                                                        onChange={() => setNewTrip({ ...newTrip, calculationType: 'MANUAL' })}
                                                        className="accent-[#D8621C]" />
                                                    <span className="text-sm text-white">Manual Entry</span>
                                                </label>
                                            </div>
                                            {(newTrip.calculationType === 'TIME' || !newTrip.calculationType) ? (
                                                <>
                                                    <div>
                                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Start Time</label>
                                                        <input
                                                            type="time" required={newTrip.calculationType !== 'METER'}
                                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-2 py-3 text-white focus:outline-none focus:border-[#D8621C] text-sm"
                                                            value={newTrip.startTime || ''} onChange={(e) => setNewTrip({ ...newTrip, startTime: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">End Time</label>
                                                        <input
                                                            type="time" required={newTrip.calculationType !== 'METER'}
                                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-2 py-3 text-white focus:outline-none focus:border-[#D8621C] text-sm"
                                                            value={newTrip.endTime || ''} onChange={(e) => setNewTrip({ ...newTrip, endTime: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2" title="Lunch / Break (Hrs)">Break (Hr)</label>
                                                        <input
                                                            type="number" step="0.5" min="0"
                                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                            value={newTrip.breakHours || ''} onChange={(e) => setNewTrip({ ...newTrip, breakHours: e.target.value })}
                                                        />
                                                    </div>
                                                </>
                                            ) : newTrip.calculationType === 'METER' ? (
                                                <>
                                                    <div>
                                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Start Meter</label>
                                                        <input
                                                            type="number" step="0.1" min="0" required={newTrip.calculationType === 'METER'}
                                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-2 py-3 text-white focus:outline-none focus:border-[#D8621C] text-sm"
                                                            value={newTrip.startMeter || ''} onChange={(e) => setNewTrip({ ...newTrip, startMeter: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">End Meter</label>
                                                        <input
                                                            type="number" step="0.1" min="0" required={newTrip.calculationType === 'METER'}
                                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-2 py-3 text-white focus:outline-none focus:border-[#D8621C] text-sm"
                                                            value={newTrip.endMeter || ''} onChange={(e) => setNewTrip({ ...newTrip, endMeter: e.target.value })}
                                                        />
                                                    </div>
                                                    <div></div>
                                                </>
                                            ) : (
                                                <>
                                                    <div>
                                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Total Hours</label>
                                                        <input
                                                            type="number" step="0.5" min="0" required={newTrip.calculationType === 'MANUAL'}
                                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-2 py-3 text-white focus:outline-none focus:border-[#D8621C] text-sm"
                                                            value={newTrip.manualTotalHours || ''} onChange={(e) => setNewTrip({ ...newTrip, manualTotalHours: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-span-2"></div>
                                                </>
                                            )}
                                            <div>
                                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Total Hours</label>
                                                <div className="w-full h-[46px] bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-2 py-3 text-orange-400 font-bold flex items-center justify-center">
                                                    {calculatedTotalHours} h
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {newTrip.machineryBillingMode === 'DAILY' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Number of Days</label>
                                                <input
                                                    type="number" step="0.5" min="0" required
                                                    className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                    value={newTrip.numberOfDays || '1'} onChange={(e) => setNewTrip({ ...newTrip, numberOfDays: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : isBikeOrCar ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Purpose</label>
                                            <input
                                                type="text" required placeholder="e.g. Personal Issue, Parts purchase"
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.source} onChange={(e) => setNewTrip({ ...newTrip, source: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Fuel Type</label>
                                            <select
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.material === 'Blue Metal' ? 'Petrol' : newTrip.material}
                                                onChange={(e) => setNewTrip({ ...newTrip, material: e.target.value })}
                                            >
                                                <option value="Petrol">Petrol</option>
                                                <option value="EV">Electric / EV</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Source / From</label>
                                            <input
                                                type="text" required placeholder="e.g. Chennai"
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.source} onChange={(e) => setNewTrip({ ...newTrip, source: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Destination / To</label>
                                            <input
                                                type="text" required placeholder="e.g. Bangalore"
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.destination} onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className={`grid ${isTipper ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                        {isTipper && (
                                            <div>
                                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Material</label>
                                                <input
                                                    type="text" required placeholder="Blue Metal"
                                                    className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                    value={newTrip.material} onChange={(e) => setNewTrip({ ...newTrip, material: e.target.value })}
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Load (Tons)</label>
                                            <input
                                                type="number" step="0.1" required placeholder="20.5"
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.loadWeight} onChange={(e) => setNewTrip({ ...newTrip, loadWeight: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Status</label>
                                    <select
                                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newTrip.status}
                                        onChange={(e) => setNewTrip({ ...newTrip, status: e.target.value })}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                                {!isMonthly && (
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">{isBikeOrCar ? 'Fuel Cost (₹)' : 'Diesel Cost (₹)'}</label>
                                        <input
                                            type="number" placeholder="Actual cost e.g. 5000"
                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newTrip.dieselCost} onChange={(e) => setNewTrip({ ...newTrip, dieselCost: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            {!isBikeOrCar && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Driver Salary (₹)</label>
                                            <input
                                                type="number" placeholder="e.g. 1500"
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.driverSalary} onChange={(e) => setNewTrip({ ...newTrip, driverSalary: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Driver Food (₹)</label>
                                            <input
                                                type="number" placeholder="e.g. 300"
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.foodAmount} onChange={(e) => setNewTrip({ ...newTrip, foodAmount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {isTipper && (
                                        <div className="mt-4">
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Material Purchase Cost (₹)</label>
                                            <input
                                                type="number" placeholder="e.g. Own money spent on M-Sand"
                                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                                value={newTrip.materialPurchaseCost} onChange={(e) => setNewTrip({ ...newTrip, materialPurchaseCost: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {isMachinery && newTrip.machineryBillingMode === 'HOURLY' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Hourly Rate (₹)</label>
                                        <input
                                            type="number" required placeholder="1000"
                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newTrip.hourlyRate} onChange={(e) => setNewTrip({ ...newTrip, hourlyRate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Total Charge (₹)</label>
                                        <input
                                            type="number" required placeholder="Calculated automatically or enter manually"
                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#10B981] font-bold focus:outline-none focus:border-[#D8621C]"
                                            value={newTrip.tripCharges} onChange={(e) => setNewTrip({ ...newTrip, tripCharges: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {isMachinery && newTrip.machineryBillingMode === 'DAILY' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Daily Rate (₹)</label>
                                        <input
                                            type="number" required placeholder="e.g. 8000"
                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newTrip.dailyRate || ''} onChange={(e) => setNewTrip({ ...newTrip, dailyRate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Total Charge (₹)</label>
                                        <input
                                            type="number" required placeholder="e.g. 8000"
                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#10B981] font-bold focus:outline-none focus:border-[#D8621C]"
                                            value={newTrip.tripCharges} onChange={(e) => setNewTrip({ ...newTrip, tripCharges: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {(!isMachinery && !isBikeOrCar) || (isMachinery && newTrip.machineryBillingMode === 'TRIP') ? (
                                <div className="grid grid-cols-1 gap-4 mt-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                                            {isMonthly ? 'Extra Trip Charge (Optional)' : 'Expected Trip Charge (₹)'}
                                        </label>
                                        <input
                                            type="number" required={!isMonthly} placeholder="e.g. 5000"
                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newTrip.tripCharges} onChange={(e) => setNewTrip({ ...newTrip, tripCharges: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : null}

                            <div className="pt-4 flex justify-end gap-3 border-t border-[#2A2A2A] mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newTrip.vehicleId || (!isBikeOrCar && !newTrip.customerName) || !newTrip.driverName}
                                    className="px-5 py-2.5 bg-[#D8621C] text-white rounded-xl text-sm font-medium hover:bg-[#c25617] transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Trip'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Edit Trip Modal */}
            {isEditModalOpen && editingTrip && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl w-full max-w-lg shadow-2xl h-max max-h-[90vh] flex flex-col">
                        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#151515] sticky top-0 rounded-t-2xl z-10">
                            <h2 className="text-white font-bold text-lg">Edit Trip</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Trip Charges / Profit</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                        value={editingTrip.tripCharges || ''}
                                        onChange={(e) => setEditingTrip({ ...editingTrip, tripCharges: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                {editingTrip?.vehicle?.billingType !== 'MONTHLY' && (
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Diesel Cost</label>
                                        <input
                                            type="number"
                                            className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                            value={editingTrip.dieselCost || ''}
                                            onChange={(e) => setEditingTrip({ ...editingTrip, dieselCost: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Driver Salary</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                        value={editingTrip.driverSalary || ''}
                                        onChange={(e) => setEditingTrip({ ...editingTrip, driverSalary: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Food / Bata</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8621C]"
                                        value={editingTrip.foodAmount || ''}
                                        onChange={(e) => setEditingTrip({ ...editingTrip, foodAmount: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-[#2A2A2A] mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <SecurityPinModal
                isOpen={isSecurityModalOpen}
                onClose={() => {
                    setIsSecurityModalOpen(false);
                    setPendingAction(null);
                }}
                onSuccess={handleSecuritySuccess}
                actionName={pendingAction?.type === 'edit' ? 'edit this trip' : 'delete this trip'}
            />
        </div>
    );
};

export default Trips;
