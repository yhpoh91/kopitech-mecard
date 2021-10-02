module.exports = (sequelize, DataTypes) => {
  const Example = sequelize.define('Example', {
    id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
  }, {
    timestamps: true,
  });

  Example.associate = (models) => {
    // associations can be defined here
  };

  return Example;
};