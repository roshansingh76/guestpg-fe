import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, MapPin, Phone, Mail, Home, Users, Utensils } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { getPG, listRooms } from '../../services/pgService'

export default function PGView() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pg, setPg] = useState(null)
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getPG(id), listRooms(id).catch(() => [])])
            .then(([pgData, roomData]) => {
                setPg(pgData)
                setRooms(Array.isArray(roomData) ? roomData : [])
            })
            .catch(() => toast.error('Failed to load PG details'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <p className="text-center text-gray-500 py-12">Loading...</p>
    if (!pg) return <p className="text-center text-red-500 py-12">PG not found</p>

    const amenities = pg.pgAmenities?.map((a) => a.amenity?.name).filter(Boolean) || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">PG details</p>
                    <h1 className="text-3xl font-semibold text-gray-900">{pg.pgName}</h1>
                </div>
                <Button
                    onClick={() => navigate('/owner/pgs')}
                    variant="ghost"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                    <ArrowLeft size={18} /> Back
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Property details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoRow label="PG name" value={pg.pgName} />
                            <InfoRow label="Type" value={pg.pgType} />
                            <InfoRow
                                label="Status"
                                value={
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                            pg.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {pg.status}
                                    </span>
                                }
                            />
                            <InfoRow label="Total rooms" value={pg.numberOfRooms} />
                            <InfoRow
                                label="Food available"
                                value={pg.isFoodAvailable ? 'Yes' : 'No'}
                                icon={<Utensils size={14} className="text-gray-400" />}
                            />
                            <InfoRow
                                label="Location"
                                value={`${pg.city?.name || 'N/A'}, ${pg.state || ''}`}
                                icon={<MapPin size={14} className="text-gray-400" />}
                            />
                        </div>

                        <div className="mt-4">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Address</p>
                            <p className="text-gray-800">
                                {pg.addressLine1}
                                {pg.addressLine2 ? `, ${pg.addressLine2}` : ''}
                            </p>
                            {pg.nearbyMark && <p className="text-sm text-gray-500 mt-1">Near: {pg.nearbyMark}</p>}
                        </div>

                        {amenities.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {amenities.map((a) => (
                                        <span key={a} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 font-medium">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Rooms list */}
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <Home size={18} className="text-gray-400" />
                            <h2 className="text-lg font-semibold text-gray-800">Rooms ({rooms.length})</h2>
                        </div>
                        {rooms.length === 0 ? (
                            <p className="text-gray-400 text-sm">No rooms added yet</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left text-gray-600">
                                    <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3">Room no.</th>
                                            <th className="px-4 py-3">Beds</th>
                                            <th className="px-4 py-3">Available</th>
                                            <th className="px-4 py-3">Price/bed</th>
                                            <th className="px-4 py-3">AC</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {rooms.map((room) => (
                                            <tr key={room.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{room.roomNumber}</td>
                                                <td className="px-4 py-3">{room.totalBeds}</td>
                                                <td className="px-4 py-3">{room.availableBeds}</td>
                                                <td className="px-4 py-3">₹ {room.pricePerBed?.toLocaleString()}</td>
                                                <td className="px-4 py-3">{room.acType}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Owner info */}
                <div>
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={18} className="text-gray-400" />
                            <h2 className="text-lg font-semibold text-gray-800">Owner info</h2>
                        </div>
                        <div className="space-y-3">
                            <InfoRow label="Name" value={pg.ownerName} />
                            <InfoRow
                                label="Phone"
                                value={pg.ownerPhone}
                                icon={<Phone size={14} className="text-gray-400" />}
                            />
                            <InfoRow
                                label="Email"
                                value={pg.ownerEmail}
                                icon={<Mail size={14} className="text-gray-400" />}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ label, value, icon }) {
    return (
        <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
            <div className="flex items-center gap-1 text-gray-800">
                {icon}
                <span>{value ?? 'N/A'}</span>
            </div>
        </div>
    )
}
