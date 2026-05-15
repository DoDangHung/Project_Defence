/** @format */

import prisma from "../src/config/db.js";

const serviceCategories = [
  {
    name: "General check-up",
    slug: "kham-tong-quat",
    description: "Dịch vụ khám tổng quát, sức khỏe định kỳ",
    icon: "Stethoscope",
    color: "#3B82F6",
    priority: 1,
  },
  {
    name: "Dental Examination",
    slug: "kham-nha-khoa",
    description: "Dịch vụ khám và điều trị răng miệng",
    icon: "Smile",
    color: "#10B981",
    priority: 2,
  },
  {
    name: "Medical Examination",
    slug: "xet-nghiem-y-hoc",
    description: "Dịch vụ xét nghiệm máu, sinh hóa, vi sinh",
    icon: "TestTube",
    color: "#8B5CF6",
    priority: 3,
  },
  {
    name: "Mental Health Examination",
    slug: "suc-khoe-tinh-than",
    description: "Dịch vụ khám và tư vấn tâm lý",
    icon: "Brain",
    color: "#EC4899",
    priority: 4,
  },
  {
    name: "Specialty Examination",
    slug: "kham-chuyen-khoa",
    description:
      "Dịch vụ khám các chuyên khoa: Cardiology, Neurology, Dermatology...",
    icon: "Heart",
    color: "#F59E0B",
    priority: 5,
  },
];

const clinics = [
  {
    name: "Phòng Khám Đa Khoa Tâm Đức",
    slug: "phong-kham-da-khoa-tam-duc",
    description:
      "Phòng khám đa khoa với đội ngũ bác sĩ chuyên nghiệp, trang thiết bị hiện đại.",
    phone: "028 1234 5678",
    email: "contact@tamduc.com",
    address: "123 Đường Nguyễn Trãi",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    latitude: 10.7629,
    longitude: 106.6822,
    openingTime: "08:00",
    closingTime: "17:00",
    isActive: true,
    categorySlug: "kham-tong-quat",
  },
  {
    name: "Nha Khoa Thẩm Mỹ Quốc Tế",
    slug: "nha-khoa-tham-my-quoc-te",
    description: "Phòng khám chuyên sâu về nha khoa thẩm mỹ và điều trị.",
    phone: "028 9876 5432",
    email: "info@dentalcare.com",
    address: "456 Đường Lê Văn Việt",
    ward: "Phường 5",
    district: "Quận 9",
    city: "TP. Hồ Chí Minh",
    latitude: 10.8099,
    longitude: 106.7704,
    openingTime: "08:00",
    closingTime: "18:00",
    isActive: true,
    categorySlug: "kham-nha-khoa",
  },
  {
    name: "Phòng Khám Nha Khoa Minh Châu",
    slug: "phong-kham-nha-khoa-minh-chau",
    description: "Chuyên niềng răng, implant, răng sứ thẩm mỹ.",
    phone: "028 3456 7890",
    email: "minhchau@dental.com",
    address: "789 Đường Trần Hưng Đạo",
    ward: "Phường 3",
    district: "Quận 5",
    city: "TP. Hồ Chí Minh",
    latitude: 10.7535,
    longitude: 106.6623,
    openingTime: "08:30",
    closingTime: "17:00",
    isActive: true,
    categorySlug: "kham-nha-khoa",
  },
  {
    name: "Trung Tâm Xét Nghiệm Việt Mỹ",
    slug: "trung-tam-xet-nghiem-viet-my",
    description: "Trung tâm xét nghiệm y học với công nghệ hiện đại nhất.",
    phone: "028 2345 6789",
    email: "lab@vietmy.com",
    address: "321 Đường Hoàng Sa",
    ward: "Phường 2",
    district: "Quận 3",
    city: "TP. Hồ Chí Minh",
    latitude: 10.7831,
    longitude: 106.6844,
    openingTime: "07:00",
    closingTime: "19:00",
    isActive: true,
    categorySlug: "xet-nghiem-y-hoc",
  },
  {
    name: "Phòng Khám Tâm Lý Tâm An",
    slug: "phong-kham-tam-ly-tam-an",
    description: "Phòng khám chuyên về sức khỏe tinh thần và tâm lý.",
    phone: "028 4567 8901",
    email: "contact@taman.vn",
    address: "555 Đường Phạm Văn Đồng",
    ward: "Phường 13",
    district: "Quận Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    latitude: 10.8034,
    longitude: 106.7183,
    openingTime: "08:00",
    closingTime: "18:00",
    isActive: true,
    categorySlug: "suc-khoe-tinh-than",
  },
  {
    name: "Viện Tim Mạch Quang Minh",
    slug: "vien-tim-mach-quang-minh",
    description: "Viện chuyên sâu về tim mạch với công nghệ tiên tiến nhất.",
    phone: "028 4567 8901",
    email: "quangminh@heartcare.com",
    address: "555 Đường Phạm Văn Đồng",
    ward: "Phường 13",
    district: "Quận Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    latitude: 10.8034,
    longitude: 106.7183,
    openingTime: "07:30",
    closingTime: "17:30",
    isActive: true,
    categorySlug: "kham-chuyen-khoa",
  },
  {
    name: "Bệnh Viện Quốc Tế Hùng Vương",
    slug: "benh-vien-quoc-te-hung-vuong",
    description: "Bệnh viện quốc tế với các chuyên khoa toàn diện.",
    phone: "028 9876 5432",
    email: "info@hungvuong.com",
    address: "456 Đường Lê Văn Việt",
    ward: "Phường 5",
    district: "Quận 9",
    city: "TP. Hồ Chí Minh",
    latitude: 10.8099,
    longitude: 106.7704,
    openingTime: "07:00",
    closingTime: "18:00",
    isActive: true,
    categorySlug: "kham-chuyen-khoa",
  },
];

const specialties = [
  // Khám tổng quát
  {
    name: "Khám sức khỏe tổng quát",
    slug: "kham-suc-khoe-tong-quat",
    description: "Khám sức khỏe định kỳ",
    categorySlug: "kham-tong-quat",
  },
  {
    name: "Tiêm chủng",
    slug: "tiem-chung",
    description: "Tiêm phòng vaccine",
    categorySlug: "kham-tong-quat",
  },
  {
    name: "Tư vấn dinh dưỡng",
    slug: "tu-van-dinh-duong",
    description: "Tư vấn chế độ ăn uống",
    categorySlug: "kham-tong-quat",
  },

  // Khám nha khoa
  {
    name: "Nha khoa tổng quát",
    slug: "nha-khoa-tong-quat",
    description: "Khám răng tổng quát",
    categorySlug: "kham-nha-khoa",
  },
  {
    name: "Niềng răng",
    slug: "nieng-rang",
    description: "Chỉnh nha - niềng răng",
    categorySlug: "kham-nha-khoa",
  },
  {
    name: "Implant răng",
    slug: "implant-rang",
    description: "Trồng implant răng",
    categorySlug: "kham-nha-khoa",
  },
  {
    name: "Răng sứ thẩm mỹ",
    slug: "rang-su-tham-my",
    description: "Làm răng sứ",
    categorySlug: "kham-nha-khoa",
  },

  // Xét nghiệm y học
  {
    name: "Xét nghiệm máu",
    slug: "xet-nghiem-mau",
    description: "Xét nghiệm công thức máu, sinh hóa",
    categorySlug: "xet-nghiem-y-hoc",
  },
  {
    name: "Xét nghiệm sinh hóa",
    slug: "xet-nghiem-sinh-hoa",
    description: "Xét nghiệm đường huyết, mỡ máu",
    categorySlug: "xet-nghiem-y-hoc",
  },
  {
    name: "Xét nghiệm vi sinh",
    slug: "xet-nghiem-vi-sinh",
    description: "Xét nghiệm vi khuẩn, virus",
    categorySlug: "xet-nghiem-y-hoc",
  },

  // Sức khỏe tinh thần
  {
    name: "Tư vấn tâm lý",
    slug: "tu-van-tam-ly",
    description: "Tư vấn tâm lý cá nhân",
    categorySlug: "suc-khoe-tinh-than",
  },
  {
    name: "Trị liệu tâm lý",
    slug: "tri-lieu-tam-ly",
    description: "Liệu pháp tâm lý chuyên sâu",
    categorySlug: "suc-khoe-tinh-than",
  },
  {
    name: "Khám tâm thần",
    slug: "kham-tam-than",
    description: "Khám và điều trị bệnh tâm thần",
    categorySlug: "suc-khoe-tinh-than",
  },

  // Khám chuyên khoa
  {
    name: "Tim mạch",
    slug: "tim-mach",
    description: "Chuyên về tim mạch và huyết áp",
    categorySlug: "kham-chuyen-khoa",
  },
  {
    name: "Thần kinh",
    slug: "than-kinh",
    description: "Chuyên về thần kinh và não",
    categorySlug: "kham-chuyen-khoa",
  },
  {
    name: "Da liễu",
    slug: "da-lieu",
    description: "Điều trị các bệnh về da",
    categorySlug: "kham-chuyen-khoa",
  },
  {
    name: "Nhi khoa",
    slug: "nhi-khoa",
    description: "Chăm sóc sức khỏe trẻ em",
    categorySlug: "kham-chuyen-khoa",
  },
  {
    name: "Ngoại khoa",
    slug: "ngoai-khoa",
    description: "Phẫu thuật và điều trị các bệnh ngoại",
    categorySlug: "kham-chuyen-khoa",
  },
  {
    name: "Xương khớp",
    slug: "xuong-khop",
    description: "Điều trị các bệnh xương khớp",
    categorySlug: "kham-chuyen-khoa",
  },
];

const rooms = [
  { roomNumber: "ICU-01", type: "ICU", status: "available" },
  { roomNumber: "ICU-02", type: "ICU", status: "available" },
  { roomNumber: "P-101", type: "Private", status: "available" },
  { roomNumber: "P-102", type: "Private", status: "available" },
  { roomNumber: "P-103", type: "Private", status: "available" },
  { roomNumber: "G-201", type: "General", status: "available" },
  { roomNumber: "G-202", type: "General", status: "available" },
  { roomNumber: "G-203", type: "General", status: "available" },
  { roomNumber: "G-204", type: "General", status: "available" },
  { roomNumber: "E-301", type: "Emergency", status: "available" },
  { roomNumber: "E-302", type: "Emergency", status: "available" },
];

async function main() {
  console.log(
    "Starting seed for Service Categories, Clinics, Specialties, Rooms...",
  );

  // Create Service Categories
  const createdCategories = {};
  for (const category of serviceCategories) {
    const existing = await prisma.serviceCategory.findUnique({
      where: { slug: category.slug },
    });
    if (!existing) {
      const created = await prisma.serviceCategory.create({ data: category });
      createdCategories[category.slug] = created;
      console.log(`Created category: ${category.name}`);
    } else {
      createdCategories[category.slug] = existing;
      console.log(`Category already exists: ${category.name}`);
    }
  }

  // Create specialties
  for (const specialty of specialties) {
    const existing = await prisma.specialty.findUnique({
      where: { slug: specialty.slug },
    });
    const categoryId = createdCategories[specialty.categorySlug]?.id;
    if (!existing) {
      await prisma.specialty.create({
        data: {
          name: specialty.name,
          slug: specialty.slug,
          description: specialty.description,
          categoryId,
        },
      });
      console.log(`Created specialty: ${specialty.name}`);
    } else {
      // Update category if exists but categoryId is null
      if (!existing.categoryId && categoryId) {
        await prisma.specialty.update({
          where: { id: existing.id },
          data: { categoryId },
        });
      }
      console.log(`Specialty already exists: ${specialty.name}`);
    }
  }

  // Create clinics
  const createdClinics = [];
  for (const clinic of clinics) {
    const existing = await prisma.clinic.findUnique({
      where: { slug: clinic.slug },
    });
    const categoryId = createdCategories[clinic.categorySlug]?.id;
    if (!existing) {
      const { categorySlug, ...clinicData } = clinic;
      const created = await prisma.clinic.create({
        data: {
          ...clinicData,
          categoryId,
        },
      });
      createdClinics.push(created);
      console.log(`Created clinic: ${clinic.name}`);
    } else {
      // Update category if exists but categoryId is null
      if (!existing.categoryId && categoryId) {
        await prisma.clinic.update({
          where: { id: existing.id },
          data: { categoryId },
        });
      }
      createdClinics.push(existing);
      console.log(`Clinic already exists: ${clinic.name}`);
    }
  }

  // Create rooms
  const createdRooms = [];
  for (const room of rooms) {
    const existing = await prisma.room.findUnique({
      where: { roomNumber: room.roomNumber },
    });
    if (!existing) {
      const created = await prisma.room.create({ data: room });
      createdRooms.push(created);
      console.log(`Created room: ${room.roomNumber}`);
    } else {
      createdRooms.push(existing);
      console.log(`Room already exists: ${room.roomNumber}`);
    }
  }

  // Get all doctors
  const doctors = await prisma.doctor.findMany({
    include: { user: true },
  });

  console.log(`Found ${doctors.length} doctors in database`);

  // Assign doctors to clinics (first clinic by default)
  if (
    doctors.length > 0 &&
    createdClinics.length > 0 &&
    createdRooms.length > 0
  ) {
    const defaultClinic = createdClinics[0];
    const defaultRoom =
      createdRooms.find((r) => r.type === "General") || createdRooms[0];

    for (const doctor of doctors) {
      const existingAssignment = await prisma.doctorClinicAssignment.findFirst({
        where: { doctorId: doctor.id },
      });

      if (!existingAssignment) {
        await prisma.doctorClinicAssignment.create({
          data: {
            doctorId: doctor.id,
            clinicId: defaultClinic.id,
            roomId: defaultRoom.id,
            isPrimary: true,
            status: "active",
          },
        });
        console.log(
          `Assigned doctor "${doctor.user?.firstName} ${doctor.user?.lastName}" to clinic "${defaultClinic.name}"`,
        );
      } else {
        console.log(
          `Doctor "${doctor.user?.firstName} ${doctor.user?.lastName}" already assigned to a clinic`,
        );
      }
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
